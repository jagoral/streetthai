---
name: to-linear-task
description: Synthesize the current session context into a concise, seam-first Linear issue in project StreetThai (P-TOM-1, team TOM).
argument-hint: "[label, priority, or extra context - or empty]"
disable-model-invocation: true
---

Turn the current session's settled discussion, spec, or investigation into one concise Linear issue in project **StreetThai** (`P-TOM-1`, team `TOM`).

## 1. Gather context

- Inspect the codebase, `GLOSSARY.md`, and the governing product chapter (00-05 from the `.product-docs/` mirror, refreshed with `pnpm product:pull`; 06-09 from `internal-docs/product-vision/`) and any newer ADR in `docs/adr/` so every term, seam, module name, and constraint matches reality.
- Do not re-interview the user for decisions already settled in this session. Ask concisely only for what is genuinely missing: label (`Feature`, `Improvement`, or `Bug`), priority (`1` Urgent .. `4` Low), unresolved scope boundaries, or blocking open questions.
- Check for related or duplicate issues with `list_issues(project: "P-TOM-1", query: "<keywords>")`.

## 2. Draft the spec

Use [references/task-template.md](references/task-template.md). Follow these rules:

- **Concise and seam-first:** name the highest testing seam and the deep module interface (`src/packages/<name>/`) being added or changed. Omit brittle file paths and code snippets unless a compact type, schema, or state-machine snippet encodes a decision more precisely than prose.
- **Example Mapping discipline:** turn requirements into numbered rules (`R1..Rn`) with concrete input/output or refusal examples, tagging each rule with its check (`node`, `browser`, `e2e`, `formal`, `lint`, `manual`).
- **Never guess open decisions:** put unresolved questions in `## Open Questions` (`Q1..Qn`) with concrete options, a recommendation, and which rules (`? Qn`) they block.
- **Kill-conditions check:** if the task touches any row of `AGENTS.md`'s Kill-conditions table, include its verification check (`pnpm verify:<area>` or `formal-verify` task) in `## Testing & Verification`.
- **Single source:** state each fact once; cross-reference by `R<n>` or `Q<n>` instead of repeating it.

## 3. Confirm and publish

1. Show the user the drafted title, metadata (label, priority, state: `Todo` if any part is actionable, `Backlog` only if every rule is blocked on open `Q<n>`), and Markdown body.
2. Once the user confirms, create the issue with Linear MCP `save_issue`:
   - `title`: issue title
   - `description`: Markdown body
   - `team: "TOM"`
   - `project: "P-TOM-1"`
   - `labels`: one of `["Feature"]`, `["Improvement"]`, `["Bug"]`
   - `state`: `"Todo"` or `"Backlog"`
   - `priority`: `1`..`4` (omit if none)
3. Link the created issue to this thread (`link_issue` if available) and reply with the identifier (`TOM-<n>`) and URL.
