# Linear Task Template

Drop any optional section that has nothing to say. Keep the full issue concise enough to read in two minutes.

```markdown
## Problem & Solution

{2-4 sentences from the user's perspective: what is broken or missing today, and what changes. No implementation details.}

## Open Questions

{Optional. Omit if none are open.}

- **Q1:** {decision needed}. Options: (a) {option}, (b) {option}. Recommended: (a) because {reason}. Blocks `R2`.

## Rules & Acceptance Criteria

- **R1 {Rule in one sentence}** (`node` | `browser` | `e2e` | `formal` | `lint` | `manual`)
  - {Concrete input/state}: {observable result}
  - {Refusal or edge case}: {exact error/behavior}
- **R2 {Rule in one sentence}** (`browser`)
  - Given {state}, when {action}, then {result} (or `? Q1` if blocked)

## Seams & Implementation Decisions

- **Seam:** {highest seam / public entry point of `src/packages/<name>/` that callers and tests cross}
- **Initial design:** {initial architectural, schema, or contract choices; inline a short type/schema snippet only when prose is less precise}

## Testing & Verification

- **Behavior tested:** {external behavior verified through the seam}
- **Formal / kill-condition check:** {`pnpm verify:<area>` or `N/A` if no kill-condition is touched}

## Out of Scope

- {Consciously excluded item, with reason or follow-up issue key if known}

## Fog

{Optional. Coarse future unknowns not sharp enough to slice into sub-issues yet.}

- {Unknown item and what earlier work will clarify it}

## Decisions Log

{Optional. Dated changes and answered questions recorded after initial publish.}

- **<YYYY-MM-DD> [Q1]:** {agreed answer}, because {reason}.
- **<YYYY-MM-DD> [Decided]:** {choice}, because {reason}.
```

## Updating a parent issue (canonical procedure)

`/to-subtasks` and `/take-subtasks-to-pr` use this procedure when editing a parent description:

1. Re-fetch the latest issue body with `get_issue(id: "<TOM-n>")`.
2. Update the description via `save_issue(id: "<TOM-n>", patch: [...])` (atomic partial edits), or pass full `description` if adding a new section.
3. Never reuse `Q<n>` or `R<n>` identifiers.
4. When answering `Q<n>`:
   - Remove the `Q<n>` bullet from `## Open Questions` (and drop the section if empty).
   - Replace `? Q<n>` in the affected rules with the agreed value.
   - Append `- **<YYYY-MM-DD> [Q<n>]:** {answer}, because {reason}.` to `## Decisions Log`.
   - Move the parent from `Backlog` to `Todo` if any rule is now actionable.
   - Remove `Q<n>` from every sub-issue's `Gated by:` line (`save_issue` `patch`), delete the `Gated by:` line if no `Q` remains, and move the sub-issue from `Backlog` to `Todo` if no open `Q` still gates it.
5. All post-publish cross-cutting decisions belong in the parent's `## Decisions Log` - never scatter them into sub-issue comments.
