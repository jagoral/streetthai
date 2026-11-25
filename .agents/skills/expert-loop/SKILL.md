---
name: expert-loop
description: Iterate on any work (doc, plan, API, code, design, copy, skill) until a panel of expert subagents scores it at a bar, e.g. "avg 9, floor 8.5". Use when the user says "iterate until X/10", asks for experts, personas, cold readers, a council or rival proposals to score the work, or leaves a bar to reach unattended.
argument-hint: "[work] until [avg X, floor Y] [judged by ...]"
---

# Expert loop

Make the work, have independent experts score it, fix what they block on, score again. Stop when the bar is met.

Makers never score their own work. Consultants who shaped the brief never score it either.

## 1. Pin the run

Write into `<run>/STATE.md` before anything is made:

- **Bar**: average and floor. "8.5/10" alone means avg 8.5, floor 8.0. Default avg 9, floor 8.5, max 6 rounds.
- **Base**: the version the user last approved. Build on nothing else.
- **Fixed**: the user's decisions, facts, medium and style rules. Reviewers do not re-litigate them.
- **Panel**: 3-6 lenses (see [shapes](references/shapes.md)). Experts the user names always join.
- **Shape**: refine, rivals, consult first, cold read, or council.

`<run>` is the project's existing run folder, else `.scratch/expert-loop/<slug>/`. Keep `STATE.md` current every round so a fresh session can continue.

```bash
sb() { python3 <skill-dir>/scripts/scoreboard.py --file <run>/scores.json "$@"; }
sb init --avg 9 --floor 8.5 --reason "user, <date>"
```

## 2. Make

Use the cheapest medium that can be judged: an outline before prose, signatures before code, one screen before the flow. Brief makers with the outcome, the fixed list, the craft skills to load and the exact output path.

## 3. Evidence

Run the project's checks and the user's rules yourself. Record each with `sb gate --round N --name <check> --result pass|fail`. Fix failing checks before you spend a round. Reviewers open the real files, never your summary. When the work is general (an API, a skill), test it on 2-3 cases, not one.

## 4. Score

Give every reviewer [the brief](assets/brief.md) plus one paragraph for its lens. Spawn them all in one message, on the model the user prescribes. Save their ids.

- **Same reviewers every round.** Message them with their own blockers mapped to the fixes. A fresh reviewer forgets its blockers and invents new taste.
- **Cold readers are new every round** and see only the work.

## 5. Triage

`sb add` each score. Then:

- **Verify** claims before you rebuild on them.
- A **blocker** names what breaks, for whom, and a fix. Anything else is taste.
- **The user outranks the panel.** When they reject what the panel passed, quote them in the brief and re-score.
- **A score at the bar with real blockers is not at the bar.**
- **A blocker that returns twice becomes a check.** Write a validator and test it on broken input.
- **Fight scope creep.** Ideas outside the request go to the report, not the work.

## 6. Loop

Fix, bump the version, run `sb status`:

- `1`: next round. With rivals, `sb rank` and `sb drop` the weakest first.
- `PLATEAU`: change something structural (fresh rival, new medium, a consultant for the stuck lens), not more polish.
- `2`: max rounds. Stop and present who wants what, and your recommendation.
- `0`: done. Apply one-line tweaks, re-run checks, delete stray drafts.

"Good enough" from the user ends the run.

## The user's time

Show only passing work, at most 5 options, best first. Questions only the user can answer go to `<run>/QUESTIONS.md` with the fallback you proceed on. Anything they say mid-run joins the fixed list.

Report: outcome, `sb table`, the changes the panel drove, what is left. In a PR, add the table under `## Expert loop review`.
