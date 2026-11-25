# Linear Sub-issue Template

Each sub-issue is sized to one fresh context window and must pass the fresh-session test when read alongside its parent issue.

```markdown
## Goal

{1-2 sentences: the observable end-to-end behavior, contract, or check this sub-issue delivers, citing parent rules e.g. `R1`, `R2`.}

## Acceptance Criteria

- [ ] {Concrete verifiable behavior or check that fails if this sub-issue is skipped}
- [ ] {Additional criterion; tag check type: `node` | `browser` | `e2e` | `formal` | `lint` | `manual`}

## Seam & Notes

- **Seam:** {public entry point or boundary touched}
- **Gated by:** {`Q<n>` if blocked on an open parent question; omit if unblocked}
- **Expects from blockers:** {concrete exports, schemas, or checks expected from `blockedBy` issues; omit if none}
```

## Rules

- For multi-PR parents, use the canonical title prefix `[PR 1] `, `[PR 2] `, etc. Omit the prefix only for a single-PR parent with no `PR <k>: ` or `Branch PR <k>: ` comment.
- Do not duplicate the parent's `Problem & Solution`, `Out of Scope`, or `Decisions Log` - cite rule IDs (`R1`, `R2`) instead.
- Avoid brittle line numbers or speculative file lists; name package entry points and behaviors.
- Blocking edges live in Linear's native `blockedBy` field, not only in prose.
- Cross-cutting decisions go in the parent's `## Decisions Log`; per-slice handoff notes go in comments on this sub-issue.
