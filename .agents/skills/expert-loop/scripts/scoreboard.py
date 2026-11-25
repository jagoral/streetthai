#!/usr/bin/env python3
"""Hold an expert-loop run's bar, panel scores and hard gates, and decide when it is done.

Usage:
  scoreboard.py --file run/scores.json init --avg 9 --floor 8.5 [--max-rounds 6] [--reason "user, 2026-11-25"]
  scoreboard.py --file run/scores.json add --round 2 --reviewer ola --score 8.7 [--version r2] [--candidate A] [--note "..."]
  scoreboard.py --file run/scores.json gate --round 2 --name typecheck --result pass [--candidate A] [--detail "0 errors"]
  scoreboard.py --file run/scores.json drop --candidate B --reason "lowest two rounds running"
  scoreboard.py --file run/scores.json table [--candidate A]
  scoreboard.py --file run/scores.json rank
  scoreboard.py --file run/scores.json status [--candidate A]

The bar lives in the file, so it survives compaction and the next session reads the same one.
Running `init` again changes the bar and keeps the old one in `bar_history`.

A candidate is one competing answer (a variant, a rival). It defaults to "main".
A version defaults to "r<round>".

`status` exit codes:
  0  converged: every live candidate has all its reviewers' latest scores on one version,
     average >= avg, nobody below floor, every gate recorded for that version passes
  1  keep iterating (it prints what is missing, and a PLATEAU warning when the average stalls)
  2  stop and escalate: max rounds reached without convergence
"""

import argparse
import datetime
import json
import os
import sys

DEFAULT_CANDIDATE = "main"
DEFAULT_BAR = {"avg": 9.0, "floor": 8.5, "max_rounds": 6, "plateau": 0.3}


def main():
    args = parse_args()
    data = load(args.file)
    if args.command == "init":
        set_bar(data, args)
        save(args.file, data)
        print(describe_bar(data["bar"]))
        return 0
    if args.command == "add":
        add_score(data, args)
        save(args.file, data)
        print(f"{args.candidate} round {args.round} {args.reviewer}: {fmt(args.score)} ({version_of(args)})")
        return 0
    if args.command == "gate":
        add_gate(data, args)
        save(args.file, data)
        print(f"{args.candidate} gate {args.name}: {args.result} ({version_of(args)})")
        return 0
    if args.command == "drop":
        data["dropped"][args.candidate] = args.reason
        save(args.file, data)
        print(f"dropped {args.candidate}: {args.reason}")
        return 0
    if args.command == "table":
        print(render_tables(data, args.candidate))
        return 0
    if args.command == "rank":
        print(render_rank(data))
        return 0
    return report_status(data, args.candidate)


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--file", required=True, help="JSON file holding the run's bar, scores and gates")
    sub = parser.add_subparsers(dest="command", required=True)

    init = sub.add_parser("init", help="set or change the bar")
    init.add_argument("--avg", type=score_value, required=True)
    init.add_argument("--floor", type=score_value, help="lowest single score allowed; defaults to avg - 0.5")
    init.add_argument("--max-rounds", type=int)
    init.add_argument("--plateau", type=float, help="average gain below which two rounds count as stalled")
    init.add_argument("--reason", default="", help="who set it and why, e.g. 'user lowered it, 2026-11-15'")

    add = sub.add_parser("add", help="record one reviewer's score")
    add.add_argument("--round", type=int, required=True)
    add.add_argument("--reviewer", required=True)
    add.add_argument("--score", type=score_value, required=True)
    add.add_argument("--version")
    add.add_argument("--candidate", default=DEFAULT_CANDIDATE)
    add.add_argument("--note", default="")

    gate = sub.add_parser("gate", help="record one hard gate's result")
    gate.add_argument("--round", type=int)
    gate.add_argument("--version")
    gate.add_argument("--name", required=True)
    gate.add_argument("--result", required=True, choices=["pass", "fail"])
    gate.add_argument("--candidate", default=DEFAULT_CANDIDATE)
    gate.add_argument("--detail", default="")

    drop = sub.add_parser("drop", help="retire a candidate so status ignores it")
    drop.add_argument("--candidate", required=True)
    drop.add_argument("--reason", required=True)

    table = sub.add_parser("table", help="markdown history, rounds x reviewers")
    table.add_argument("--candidate")

    sub.add_parser("rank", help="candidates ordered by their latest average")

    status = sub.add_parser("status", help="exit 0 when the run has converged")
    status.add_argument("--candidate")

    args = parser.parse_args()
    if args.command == "gate" and args.round is None and args.version is None:
        parser.error("gate needs --round or --version")
    return args


def score_value(text):
    value = float(text)
    if not 1 <= value <= 10:
        raise argparse.ArgumentTypeError("score must be between 1 and 10")
    return value


def load(path):
    data = {"bar": dict(DEFAULT_BAR), "bar_history": [], "scores": [], "gates": [], "dropped": {}}
    if os.path.exists(path):
        with open(path) as fh:
            data.update(json.load(fh))
    return data


def save(path, data):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)


def set_bar(data, args):
    previous = dict(data["bar"])
    bar = data["bar"]
    bar["avg"] = args.avg
    bar["floor"] = args.floor if args.floor is not None else max(1.0, args.avg - 0.5)
    if args.max_rounds is not None:
        bar["max_rounds"] = args.max_rounds
    if args.plateau is not None:
        bar["plateau"] = args.plateau
    data["bar_history"].append({
        "at": datetime.date.today().isoformat(), "from": previous, "to": dict(bar), "reason": args.reason,
    })


def describe_bar(bar):
    return f"bar: average >= {fmt(bar['avg'])}, nobody below {fmt(bar['floor'])}, at most {bar['max_rounds']} rounds"


def version_of(args):
    return args.version or f"r{args.round}"


def add_score(data, args):
    data["scores"] = [
        s for s in data["scores"]
        if not (s["candidate"] == args.candidate and s["round"] == args.round and s["reviewer"] == args.reviewer)
    ]
    data["scores"].append({
        "candidate": args.candidate, "round": args.round, "version": version_of(args),
        "reviewer": args.reviewer, "score": args.score, "note": args.note,
    })


def add_gate(data, args):
    version = version_of(args)
    data["gates"] = [
        g for g in data["gates"]
        if not (g["candidate"] == args.candidate and g["version"] == version and g["name"] == args.name)
    ]
    data["gates"].append({
        "candidate": args.candidate, "version": version, "name": args.name,
        "result": args.result, "detail": args.detail,
    })


def render_tables(data, only):
    names = [only] if only else candidates(data)
    if not names:
        return "(no scores yet)"
    return "\n\n".join(render_table(data, name) for name in names)


def render_table(data, candidate):
    scores = [s for s in data["scores"] if s["candidate"] == candidate]
    if not scores:
        return f"### {candidate}\n\n(no scores yet)"
    reviewers = list(dict.fromkeys(s["reviewer"] for s in scores))
    title = f"### {candidate}" + (f" (dropped: {data['dropped'][candidate]})" if candidate in data["dropped"] else "")
    lines = [
        title, "",
        "| Round | Version | " + " | ".join(reviewers) + " | Avg | Gates |",
        "| --- | --- | " + " | ".join("---" for _ in reviewers) + " | --- | --- |",
    ]
    for number in rounds_of(scores):
        row = {s["reviewer"]: s for s in scores if s["round"] == number}
        version = next(iter(row.values()))["version"]
        cells = [fmt(row[name]["score"]) if name in row else "-" for name in reviewers]
        average = fmt(mean([s["score"] for s in row.values()]))
        lines.append(f"| {number} | {version} | " + " | ".join(cells) + f" | {average} | {gate_summary(data, candidate, version)} |")
    return "\n".join(lines)


def render_rank(data):
    rows = []
    for name in candidates(data):
        latest = latest_by_reviewer(data, name)
        if latest:
            values = [s["score"] for s in latest.values()]
            rows.append((mean(values), min(values), name))
    if not rows:
        return "(no scores yet)"
    lines = []
    for position, (average, lowest, name) in enumerate(sorted(rows, reverse=True), start=1):
        flag = "  [dropped]" if name in data["dropped"] else ""
        lines.append(f"{position}. {name}: avg {fmt(average)}, lowest {fmt(lowest)}{flag}")
    return "\n".join(lines)


def report_status(data, only):
    bar = data["bar"]
    print(describe_bar(bar))
    names = [only] if only else [c for c in candidates(data) if c not in data["dropped"]]
    if not names:
        print("no scores yet")
        return 1
    unconverged = 0
    rounds_used = 0
    for name in names:
        latest = latest_by_reviewer(data, name)
        summary = ", ".join(f"{reviewer}={fmt(s['score'])}" for reviewer, s in latest.items()) or "no scores"
        print(f"{name}: {summary}")
        issues = candidate_issues(data, name, bar)
        for issue in issues:
            print(f"  NOT CONVERGED: {issue}")
        if issues:
            unconverged += 1
            warning = plateau_warning(data, name, bar["plateau"])
            if warning:
                print(f"  PLATEAU: {warning}")
        else:
            print(f"  CONVERGED on {next(iter(latest.values()))['version']}")
        rounds_used = max(rounds_used, len(rounds_of([s for s in data["scores"] if s["candidate"] == name])))
    if not unconverged:
        return 0
    if rounds_used >= bar["max_rounds"]:
        print(f"STOP: {rounds_used} rounds used of {bar['max_rounds']}; present the open disagreement to the user")
        return 2
    return 1


def candidate_issues(data, candidate, bar):
    latest = latest_by_reviewer(data, candidate)
    if not latest:
        return ["no scores yet"]
    issues = []
    versions = list(dict.fromkeys(s["version"] for s in sorted(latest.values(), key=lambda s: s["round"])))
    if len(versions) > 1:
        issues.append(f"latest scores are for different versions {versions}; get a regression check on {versions[-1]}")
    values = [s["score"] for s in latest.values()]
    if mean(values) < bar["avg"]:
        issues.append(f"average {fmt(mean(values))} is below {fmt(bar['avg'])}")
    below = [f"{name}={fmt(s['score'])}" for name, s in latest.items() if s["score"] < bar["floor"]]
    if below:
        issues.append(f"below the floor of {fmt(bar['floor'])}: " + ", ".join(below))
    failed = [
        g["name"] for g in data["gates"]
        if g["candidate"] == candidate and g["version"] == versions[-1] and g["result"] == "fail"
    ]
    if failed:
        issues.append("failing gates: " + ", ".join(failed))
    return issues


def plateau_warning(data, candidate, threshold):
    scores = [s for s in data["scores"] if s["candidate"] == candidate]
    numbers = rounds_of(scores)
    if len(numbers) < 3:
        return ""
    averages = [mean([s["score"] for s in scores if s["round"] == n]) for n in numbers[-3:]]
    gain = averages[-1] - averages[0]
    if gain >= threshold:
        return ""
    return f"average moved {gain:+.2f} over the last two rounds; change something structural instead of polishing"


def candidates(data):
    return list(dict.fromkeys(s["candidate"] for s in data["scores"]))


def rounds_of(scores):
    return sorted({s["round"] for s in scores})


def latest_by_reviewer(data, candidate):
    latest = {}
    for s in sorted((s for s in data["scores"] if s["candidate"] == candidate), key=lambda s: s["round"]):
        latest[s["reviewer"]] = s
    return latest


def gate_summary(data, candidate, version):
    gates = [g for g in data["gates"] if g["candidate"] == candidate and g["version"] == version]
    if not gates:
        return "-"
    failed = [g["name"] for g in gates if g["result"] == "fail"]
    return "fail: " + ", ".join(failed) if failed else f"{len(gates)}/{len(gates)} pass"


def mean(values):
    return sum(values) / len(values)


def fmt(value):
    return f"{value:.2f}".rstrip("0").rstrip(".")


if __name__ == "__main__":
    sys.exit(main())
