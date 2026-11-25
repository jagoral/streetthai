---
name: internal-docs
description: Writing conventions for team-facing documentation under internal-docs/ and ADRs under docs/adr/. Use whenever writing, reviewing, or editing internal docs or ADRs.
---

# Internal docs & ADR writing style

Pages under `internal-docs/` and ADRs under `docs/adr/` are for engineers and agents working in this repo, never end users - plain GitHub-rendered Markdown where relative links and Mermaid diagrams work. Every paragraph must carry a concrete fact the reader acts on.

## Register

1. **Open with the fact that matters most.** The first sentence of the page - and of every section - states the concrete decision, constraint, or result. Never open with background preamble.
2. **A claim travels with its mechanism.** State what was decided and why it works in the same breath ("inject clocks through parameters: expiry tests stay deterministic without wall-clock waits"). A rule without its mechanism reads as superstition.
3. **Never rewrite what a skill, config, or file already says.** Link the owning file instead of planting a second copy that drifts.
4. **Headings make claims.** Name the decision or problem ("Local writes go through RxDB before Supabase"), never generic labels like "Overview" or "Background".
5. **Prefer a Mermaid diagram for structure and flow.** Replace prose that narrates a graph or state machine with a compact Mermaid diagram plus a short paragraph.
6. **Real names, real inputs and outputs.** Cite actual packages, entry points, commands, and shapes; never foo/bar or pure abstractions.
7. **Teach a shifted practice as a contrast pair.** Old way, new way, one line each.
8. **Link live files, never dated events.** Point at files or ADR numbers in the tree rather than "as discussed last Tuesday".
9. **Full sentences, fewer of them.** Write plain spoken English - no shorthand arrow chains to decode, and never write meta-commentary about the document itself ("this doc is structured as..."). When a page is too long, cut a whole section instead of compressing sentences into telegraphic fragments.
