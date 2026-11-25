---
name: take-subtasks-to-pr
description: Execute the ready Linear sub-issues of a parent task (one fresh child agent per sub-issue), log handoff comments in Linear, then open a PR.
argument-hint: "[TOM-123 | TOM-123 \"PR 2\"]"
disable-model-invocation: true
---

Orchestrate implementation of a parent Linear issue (`TOM-<n>`) in project **StreetThai** (`P-TOM-1`) by running each unblocked unit (`TOM-<x>`) sequentially in a **fresh child agent** on one feature branch, recording handoffs in Linear comments, and opening the PR when the batch completes.

An **active** unit is any sub-issue not in `Canceled` or `Duplicate` (`Done` and `In Review` count as active). Treat `Canceled` and `Duplicate` as resolved blockers and exclude them from batches and PR `Fixes` lines.

## 1. Preflight & resume

1. Link `TOM-<n>` to this thread (`link_issue` if available). Fetch the parent (`get_issue` with `includeRelations: true`), its comments (`list_comments`), and its children (`list_issues(parentId: "TOM-<n>")`).
2. **Select batch `PR <k>` & `baseBranch`:**
   - A group is **shipped** only when a parent comment starts with `PR <k>: `. If the selected group (or every group) is shipped, report the PR and stop.
   - **Single-issue mode:** if the parent has zero active sub-issues, treat `TOM-<n>` itself as the only unit in `PR 1` (open `Q<n>` or non-empty `## Fog` stops preflight).
   - **Sub-issue mode:** pick the named `[PR k]` group or the lowest unshipped group (unprefixed active sub-issues count as `[PR 1]`). Fetch relations (`get_issue` with `includeRelations: true`) for batch units and any external blockers, plus `list_comments` for `In Progress` units.
   - **`baseBranch`:** `main` for `PR 1`; for `PR <k>` (`k > 1`), read the parent comment starting with `PR <k-1>: ` and use `main` if merged or absent, else `PR <k-1>`'s branch.
3. **Preflight stops (ask the user in one batch with recommendations):**
   - Any batch unit in `Backlog` or gated by a still-open `Q<n>`, or a blocking `## Fog` item (tell the user to run `/to-subtasks TOM-<n>`).
   - Pending `STOPPED:` on an `In Progress` unit, or a `STOPPED code-review:` comment on the parent newer than its latest `Code review fixes` comment - confirm the answer (or abandon the fix pass by posting `Code review fixes (abandoned)`) and whether to pop or drop its partial stash.
   - Any external blocker not `Done`/`Canceled`/`Duplicate`, or an earlier same-parent `[PR j]` blocker not resolved unless `baseBranch` stacks on `PR <j>`.
   - Missing push/PR access or dirty working tree (ask whether to stash as `"TOM-<n> preflight"` or discard).
   - Record confirmed spec answers in the parent's `## Decisions Log` via [../to-linear-task/references/task-template.md](../to-linear-task/references/task-template.md).
4. **Branch checkout & sync:**
   - Reuse the branch from the latest parent comment starting with `Branch PR <k>: <name>, base <base>@<sha>`. Otherwise use the parent's `gitBranchName` in single-issue mode, or the first topological unit's `gitBranchName` in sub-issue mode (so Linear auto-linking never closes the parent early).
   - Fetch `origin`. Create from `origin/<baseBranch>` without tracking it if new, or switch to it and fast-forward from `origin/<name>` (stop on divergence). Ensure a `Branch PR <k>: ` comment records the branch and base SHA.
   - If the recorded base was an earlier PR branch that has since merged into `main`, rebase onto `origin/main` from the recorded base SHA and post the updated `Branch PR <k>:` comment (abort and stop on conflict).
5. **Resume or skip to ship:**
   - If every active batch unit is `In Review` or `Done`, resume any pending `STOPPED code-review:` fix pass first (verify, post `Code review fixes (<base>..<head>)`, then go to §3.2), else jump to §3.
   - Never auto-complete an `In Progress` unit: hand the fresh worker its existing commits on this branch, latest `STOPPED:` comment, and matching `"TOM-<x> partial"` stash to verify Acceptance Criteria and finish.
6. Move the parent to `In Progress` if it is still `Todo` or `Backlog`.

## 2. Execute units sequentially

While the batch has a `Todo` or `In Progress` unit whose blockers are all resolved (`Done`, `Canceled`, `Duplicate`, or `In Review` in the same or a stacked earlier PR):

1. Pick the next ready unit `TOM-<x>` in topological order and move it to `In Progress`.
2. Record `baseSha` (current `HEAD`, or the valid ancestor resume base) and pass the fresh child agent [references/worker-prompt.md](references/worker-prompt.md) plus: parent body (`## Decisions Log`, `## Out of Scope`), unit body, all `Handoff` comments from completed batch units and `blockedBy` issues, branch name, `baseSha`, and any resume context/stash disposition.
3. Run **one fresh child agent at a time** on the shared branch (prefer foreground native subagent; else `delegate_task` in the current checkout and wait for completion - never poll, never pass secrets).
4. Handle the result:
   - **`SUBTASK DONE: TOM-<x> <base>..<head>`:** verify clean tree, commit range matches `baseSha..head` with every commit referencing `TOM-<x>`, and `pnpm check` passes (when `package.json` exists). Idempotently post a `Handoff <base>..<head>:` comment on `TOM-<x>` (summary, checks, `Handoff:` facts, any `Follow-up:` items), move `TOM-<x>` to `In Review`, and append cross-cutting `Decided:` items to the parent's `## Decisions Log`.
   - **`STOPPED: TOM-<x>`:** verify clean tree, post `STOPPED: <reason>; base <baseSha>; stash "TOM-<x> partial"` (or `none`) on `TOM-<x>`, ask the user, record any spec answer on the parent, and launch a fresh child with the same `baseSha`.
   - **Unexpected failure:** stop the loop and report exact state.

If the loop exits while any active unit is neither `In Review` nor `Done`, report its blockers and stop.

## 3. Ship PR

Once every active batch unit is `In Review` or `Done` (**final PR** = all other active sub-issues are `Done` or in already-shipped `[PR j]` groups, and `## Fog` is empty):

1. Follow `.agents/skills/code-review/SKILL.md` (not the built-in `/code-review`) against `origin/<baseBranch>`, passing the parent `TOM-<n>` body and governing product chapter (00-05 from the `.product-docs/` mirror, refreshed with `pnpm product:pull`; 06-09 from `internal-docs/product-vision/`) as the spec. Present findings; for accepted findings, spawn a fresh worker (same branch, fresh `baseSha`, unit = `TOM-<n>`, scope = accepted findings), verify commits + `pnpm check`, and post `Code review fixes (<base>..<head>)` on the parent (on `STOPPED`, post `STOPPED code-review: <reason>; base <baseSha>; stash "TOM-<n> partial"; findings: ...`).
2. Run all existing applicable checks (`pnpm check`, `pnpm test:e2e` if flows changed, affected `pnpm verify:<area>`). Stop on failure.
3. Push the branch (`--force-with-lease` if rebased). Reuse an existing open PR for the branch (retargeting to `baseBranch` via harness PR tool or GitHub REST PATCH if needed), or open a new PR targeting `baseBranch` (`link_pull_request` if available). Include `Fixes TOM-<x>` for each active unit (and `Fixes TOM-<n>` once on the final PR).
4. Post `PR <k>: <url>, branch <name>` on the parent; move the parent to `In Review` only on the final PR.
5. Collect `Follow-up:` items from batch `Handoff` comments; if any exist, idempotently post `Follow-ups (PR <k>):` on the parent.

## 4. Report

Return one concise inline summary: PR URL, `baseBranch`, checks run, completed units (`TOM-<x>`, commits, one-line summary), decisions logged, out-of-scope follow-ups (ask which should become `/to-linear-task` issues), any remaining preflight/partial stashes, and next PR batch or `## Fog`.
