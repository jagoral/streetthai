# Writing a rule per surface

Draft in the target surface's style before proposing. One rule, one surface.

## `dependency-cruiser` rule (`.dependency-cruiser.cjs`)

Use for import-graph, layering, cycle, or deep-module boundary rules. Set `severity: "error"` with a clear `comment` naming what to import instead. Prove it fails on a violating import and passes on the clean tree via `lint:boundaries`.

## `oxlint` rule (`tools/oxlint/*`)

Pick or create the plugin that owns the concept (e.g. `anti-slop`, `comments`, `boundaries`, domain-specific). Put one rule per file under its `rules/`, register it in the plugin's `index.ts`, enable it at `error` in `.oxlintrc.json` (scope directory-local rules with `overrides`), and add `RuleTester` tests under `tests/`. Write a message that names what to do instead - the message is the only documentation the rule gets. Verify it fails on a violating fixture and stays quiet on the clean tree.

## Invariant test / formal verification

- **Vitest invariant or `fast-check` property test:** co-locate in the owning package's `tests/` (importing only through root entry points). State the invariant in plain English in the test title and include a failure message naming the exact offender and fix.
- **Formal check (`formal-verify`):** follow `.agents/skills/formal-verify/SKILL.md` - map directly to real code, prove it catches a deliberate broken mutation, record covered files and sync commit, and expose a single fast rerun command.

## Existing skill edit (`.agents/skills/<name>/`)

Read the whole skill first. Place the rule under the heading that owns its concept, next to the definitions and caveats it belongs with - never appended at the end. Match the skill's wording style. If the rule needs more than a few lines, put the detail in the skill's `references/` and keep a pointer in `SKILL.md`.

## New skill (`.agents/skills/<name>/SKILL.md`)

Include YAML frontmatter with `name` and a concrete `description` stating when to trigger it. Keep `SKILL.md` concise and actionable; move long examples or reference tables into `references/`.

## Repo `AGENTS.md`

Only for genuinely unautomatable rules. One bullet, imperative, stating the positive behavior, with at most one clause of why. Place it next to related bullets. If the draft needs a second sentence or a code block, it is not a one-liner - reconsider the automated or skill branches.

## Package `AGENTS.md` (`src/packages/<name>/AGENTS.md`)

Same one-bullet format as repo `AGENTS.md`, reserved for unautomatable rules that apply only inside that package. Never restate anything root `AGENTS.md` already carries, and never restate an enforced rule. When the package has no `AGENTS.md` yet, create it with a one-line `# <package> - agent notes` header.
