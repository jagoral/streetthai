---
name: add-rule
description: Route an enforceable pattern to exactly one surface - dependency-cruiser, oxlint, invariant test / formal check, skill, or AGENTS.md - confirm with the user, then write it there.
argument-hint: "[the rule or pattern to enforce]"
disable-model-invocation: true
---

<!-- Repo's version of https://github.com/EveryInc/compound-engineering-plugin/tree/main/skills/ce-compound skill -->

A review or a session surfaced a pattern worth enforcing. Classify it, propose one surface, confirm, and write it well for that surface. A rule lives in exactly one place - never write the same rule to two surfaces.

The rule is the user's decision. If its purpose, scope, or audience is unclear - what behavior it targets, when it applies, who it is for - grill the user and settle that before classifying. You gather facts, classify, and draft; the user decides.

## A good rule

A rule is an opinion the model cannot deduce on its own - a project decision, a domain gotcha, a constraint the code doesn't show. Current models need opinions and automated enforcement, not soft prose guardrails. Every draft, for any surface, must pass these criteria:

- **Changes behavior.** The no-op test: would the model already do this without the rule? A rule that fails it pays context to say nothing.
- **States the positive.** Name the behavior you want ("inject clocks through the seam"), not the ban - a prohibition half-reads as an instruction to do the thing it names. Keep a prohibition only when no positive phrasing exists, and pair it with what to do instead.
- **One behavior, checkable.** Concrete enough that a diff shows whether it was followed; an example beats an adjective.
- **Carries its why** when the reason isn't obvious - one clause, not a paragraph. A rule with a visible reason transfers to new cases; a bare command gets applied literally.
- **As short as its surface allows.** Every word is context paid on every future turn. A rule that needs paragraphs is a skill topic, not a rule.

This section is the single source of truth for rule quality - other skills point here instead of restating it.

## Classify

Walk the tree in order; the first match wins. Always prefer automated enforcement over prose.

1. **Fails the no-op test** - current models already do this, and over-adding rules is itself a failure mode. Verdict: no surface. Tell the user why and stop; write nothing.
2. **Already enforced** - types, an `oxlint` rule, `dependency-cruiser`, a runtime throw, an invariant test, or a formal verification check catches every violation. Verdict: no surface - enforced rules are never restated in prose; the error message is the rule. At most, point at where the enforcement is declared.
3. **Mechanically checkable over imports or module boundaries** - Surface: a `dependency-cruiser` rule in `.dependency-cruiser.cjs`.
4. **Mechanically checkable over source code** - a lint rule can catch every violation in AST/source. Surface: an `oxlint` rule in `tools/oxlint/*` (static analysis outranks all other work).
5. **Mechanically checkable over domain invariants or state transitions** - Surface: a fast Vitest invariant test, a `fast-check` property test, or a `formal-verify` check (TLA+ / property / exhaustive check).
6. **Fits an existing skill** - a skill under `.agents/skills/` already owns this topic. Surface: edit that skill.
7. **Big new topic** - more than a bullet's worth, genuinely unautomatable, and no existing home. Surface: a new skill under `.agents/skills/`.
8. **One-liner, genuinely unautomatable, project-wide or package-specific.** Surface: the most specific `AGENTS.md` covering all affected code - a package's own (`src/packages/<name>/AGENTS.md`) when the rule applies only inside it, repo root `AGENTS.md` otherwise.

Before proposing, sweep every surface - root and package `AGENTS.md` files, `.agents/skills/`, `.dependency-cruiser.cjs`, `tools/oxlint/*`, type-level contracts, invariant tests, and formal checks - for the same rule or one that collides with it. A duplicate or a broader rule that already covers it makes the answer "no surface"; a collision (overlap or contradiction) is the user's call - show them both rules.

## Propose and confirm

Draft the rule in the chosen surface's style first - per-surface writing guidance is in [references/surfaces.md](references/surfaces.md). Show the user the surface, the draft wording (or rule sketch), and one line on why this surface. Confirm with the user: put the proposed surface as the recommended first option and plausible runner-up surfaces as alternatives.

## Write

Write the rule to the confirmed surface only. If the user picked a different surface than proposed, redraft for that surface - surfaces read differently - before writing. For automated surfaces (`dependency-cruiser`, `oxlint`, invariant/formal check), prove the check fails on a violating fixture and stays quiet on the clean tree before closing. Close by naming the file written.
