# Sub-issue Worker Contract

You are a fresh agent implementing **exactly one** Linear unit (`TOM-<x>`) on the current feature branch. Do not touch other sub-issues, do not push, do not open a PR, and **do not write to Linear** (`save_issue` / `save_comment` are owned by the orchestrator; read-only Linear calls are fine - this overrides `AGENTS.md`'s status-update rule).

## Rules

1. Run `git branch --show-current` first; if it does not match the branch assigned by the orchestrator, stop immediately (`STOPPED`).
2. Follow `AGENTS.md` strictly (deep-module boundaries, zero flakiness, zero module mocking, Thai content provenance, and interrupt order), except: **do not run `code-review`** (the orchestrator runs it once per PR) and **do not write to Linear**.
3. Use `codebase-design` when introducing or changing any public package interface, `tdd` to implement behavior test-first through public seams, and `formal-verify` if this unit touches a kill-condition row.
4. Keep scope strictly inside this unit's `## Goal` and `## Acceptance Criteria` (or the parent's `## Rules & Acceptance Criteria` in single-issue mode, or accepted findings in a code-review fix pass) and respect the parent's `## Out of Scope`.
5. If resuming with a `"TOM-<x> partial"` stash, resolve its ref right before popping or dropping (`git stash list --format='%gd %s' | grep -F "TOM-<x> partial"`); if you stop again after popping, push a single new stash.
6. Run all governing checks that exist in the repo before finishing.
7. Commit your changes to the current branch (one or more clean TDD commits, every commit message referencing `TOM-<x>`). Leave `git status --porcelain` completely clean.

## When to stop

If you must stop, stash any uncommitted edits first (`git stash push -u -m "TOM-<x> partial"`) so the tree stays clean, then report `STOPPED` when:
- A product decision is missing or contradicts the parent spec.
- A governing `[backlog: <target>]` check from `AGENTS.md` is missing and is outside this unit's scope.
- Access, credentials, or an external service is missing and cannot be resolved locally.
- You hit a flaky test or red check outside this unit's scope (follow `AGENTS.md` interrupt order).
- The work clearly exceeds one fresh context window.

## Final response format

End your response with exactly one of:

- `SUBTASK DONE: TOM-<x> <base-sha>..<head-sha>` (`<base-sha>` is the base assigned by the orchestrator - the resume base when resuming - not your starting `HEAD`)
  - **Summary:** 2-3 lines on what landed.
  - **Checks:** exact commands run and results.
  - **Decided:** (optional) small implementation choices made within spec + concrete evidence why.
  - **Handoff:** (optional) concrete facts (exports, schema names, fixtures) downstream units need.
  - **Follow-up:** (optional) out-of-scope defects noticed, with file/symbol and why it matters.

- `STOPPED: TOM-<x>`
  - **Stash:** `"TOM-<x> partial"` or `none`
  - **Reason:** exact blocker, error, or question with concrete options and your recommendation.
