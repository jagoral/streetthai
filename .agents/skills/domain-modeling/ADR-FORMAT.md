# ADR Format

ADRs live in `docs/adr/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc. Create `docs/adr/` lazily on the first ADR.

Record **every** design or architectural decision as a concise, concrete ADR written in the `.agents/skills/internal-docs/SKILL.md` register: open with the decision itself, pair every claim with its mechanism in plain full sentences, and cite real modules, interfaces, and trade-offs.

## Template

```md
# {Claim-style title naming the decision}

{1-3 plain sentences: what we decided, the mechanism that makes it work, and the constraint or trade-off that drove it.}
```

An ADR can be a single tight paragraph. Value comes from recording *what* was decided and *why* without boilerplate.

## Optional sections

Include only when they carry non-obvious information:

- **Status** (`accepted | deprecated | superseded by ADR-NNNN`): when revisiting an earlier decision.
- **Considered options:** only when rejected alternatives are non-obvious and likely to be re-proposed later.
- **Consequences:** only when non-obvious downstream constraints or follow-up work result.

## Numbering

Scan `docs/adr/` for the highest existing number and increment by one.
