---
name: to-subtasks
description: Break a Linear issue (or graduate its Fog) into tracer-bullet Linear sub-issues with native blockedBy edges in project ThaiStreet.
argument-hint: "[TOM-123 | Linear URL | empty]"
disable-model-invocation: true
---

Break a Linear issue that exceeds one fresh context window into **Linear sub-issues** under a parent issue in project **ThaiStreet** (`P-TOM-1`, team `TOM`). Linear is the single source of truth for all sub-issues, blockers, Fog, and decisions.

## 1. Load source, existing sub-issues & escape hatch

- With a `TOM-<n>` key or Linear URL: fetch the parent via `get_issue(id: "<TOM-n>", includeRelations: true)`, its comments via `list_comments(issueId: "<TOM-n>")`, and its existing sub-issues via `list_issues(parentId: "<TOM-n>")`. For each existing sub-issue, call `get_issue(id: "<TOM-x>", includeRelations: true)` so existing `blockedBy` edges are known.
- Without an argument: ask the user to supply a `TOM-<n>` key or run `/to-linear-task` first so a parent issue exists.
- **Re-runs & Fog graduation:** if sub-issues already exist, keep them intact. Slice only unaddressed rules or `## Fog` items that are now clear, wiring new `blockedBy` edges to existing `TOM-*` IDs so nothing is duplicated. If the parent has no sub-issues yet but has a `Branch PR <k>: ` comment with no matching `PR <k>: ` comment, stop and ask the user to finish it with `/take-subtasks-to-pr TOM-<n>` or confirm abandoning that branch before slicing.
- **Escape hatch:** inspect the affected modules in the codebase. If no sub-issues exist yet and the entire parent fits cleanly in one fresh context window with no ambiguity, tell the user and skip creating sub-issues (`/take-subtasks-to-pr TOM-<n>` runs single-issue tasks directly).
- **Blocking questions:** open `Q<n>` items gate only the sub-issues that depend on them. Before slicing, ask the user to settle any other ambiguity that would send downstream sub-issues in conflicting directions (or suggest `/grill-with-docs`).

## 2. Slice into tracer-bullet sub-issues

Design each sub-issue using [references/subtask-template.md](references/subtask-template.md):

- **Vertical slices by default:** each sub-issue delivers a narrow, complete, verifiable path through the needed layers and fits in **one fresh context window**.
- **Three deliberate exceptions:**
  - **Enforcement first:** if a feature slice relies on a `[backlog: <target>]` check from `AGENTS.md` that does not exist yet (e.g. `vitest.config.ts`, `.dependency-cruiser.cjs`, `pnpm verify:<area>`), slice landing that check as an earlier blocker sub-issue before feature slices.
  - **Contract first:** when adding or widening a public package interface (`src/packages/<name>/` root entry points), slice the contract (types, schemas, JSDoc, stub/failing boundary) as its own first sub-issue that implementation sub-issues depend on.
  - **Wide refactors:** use **expand-contract** (expand new form -> migrate callers in green batches -> contract/remove old form) so checks stay green at every step.
- **Fresh-session test:** a fresh agent reading only the parent issue, this sub-issue, and prior handoff comments must be able to implement and verify it without asking what the parent was about.
- **Fog of war:** do not pre-slice work you cannot specify sharply yet. Put coarse unknowns into the parent's `## Fog` section to graduate on a later `/to-subtasks TOM-<n>` run.
- **Multi-PR grouping:**
  - Prefix each sub-issue title with `[PR 1] `, `[PR 2] `, etc. whenever the parent spans multiple PRs (unprefixed active sub-issues count as `[PR 1]`).
  - Place `Gated by: Q<n>` sub-issues and their dependents in a later `[PR n]` group so earlier PRs are not stalled.
  - When adding sub-issues to a parent with existing sub-issues or `PR <k>: ` / `Branch PR <k>: ` comments, number new groups after the highest existing `k` (add to an unshipped group only after the user confirms). If the parent's final PR has already shipped, suggest `/to-linear-task` instead.

## 3. Confirm with the user

Present the proposed breakdown as a numbered list showing for each new sub-issue:
- **Title** (including `[PR n]` prefix if multi-PR or post-PR)
- **Blocked by** (earlier sub-issues) and **Gated by** (`Q<n>`, if any)
- **Delivers** (end-to-end behavior + parent rule IDs `R<n>`)

Also list any `## Fog` additions/removals and `## Decisions Log` lines for the parent issue. Ask the user to confirm granularity, blocking edges, and PR cuts before writing to Linear.

## 4. Publish to Linear

1. Create new sub-issues in **topological order** (blockers first) via `save_issue`:
   - `title`, `description`
   - `team: "TOM"`
   - `project: "P-TOM-1"`
   - `parentId: "<parent TOM-id>"`
   - `labels` and `priority`: inherit from the parent issue
   - `state`: `"Backlog"` if gated by an open `Q<n>`, otherwise `"Todo"`
   - `blockedBy: ["TOM-..."]` using real identifiers from existing or just-created sub-issues.
2. Update the parent issue using the canonical procedure in [../to-linear-task/references/task-template.md](../to-linear-task/references/task-template.md): record any charting decisions in `## Decisions Log` and update `## Fog` (adding new unknowns, removing graduated ones). Never overwrite existing rules or close the parent.
3. Reply with a summary table of all `TOM-*` sub-issues (existing + new), their `blockedBy` edges, and the ready frontier (`Todo` sub-issues whose blockers are all `Done`, `Canceled`, `Duplicate`, or `In Review` in the same or a stacked earlier PR).
