# StreetThai (`thai-app`)

**Tag protocol:**
- `[backlog: <target>]` = must land before the feature code it governs; drop the tag once `<target>` exists and keep the rule.
- `[enforced-by: <target>]` = fully enforced by `<target>`; drop each tag as it lands and delete the rule when its last tag is gone.
- `<target>` is a repo path, `script <name>`, or `<file> rule <name>` (`<placeholder>` matches one segment); a tag covers every path in its bullet, paragraph, table row, or indented layout children.

## Context

- **Stack:** Turborepo + pnpm workspace (`apps/*` deployables, `packages/*` shared and domain modules, root `tests/` repo-level tests); every workspace extends `@streetthai/config` (TypeScript, OXLint, OXfmt). One Next.js PWA in `apps/web/` (`[backlog: apps/web/]`, TypeScript on Vercel EU), Vercel AI SDK, build-time compiled Thai G2P Trie, TanStack DB + RxDB + Dexie + Supabase Replication, Paddle.js + RevenueCat.
- **Runtime & commands:** `pnpm`, Node 24 LTS (`.nvmrc`); JDK 17+ for TLC (`[backlog: specs/tla/]`); Python + TLTK for the build-time G2P compiler (`[backlog: scripts/g2p/pyproject.toml]`). Before handoff run `pnpm check` (turbo runs `typecheck`, `lint`, and `fmt:check` in every workspace that defines them in parallel with the root Vitest `test:node` and `test:browser`; `lint:boundaries` `[backlog: .dependency-cruiser.cjs]` joins it later; CI runs it on every PR), `pnpm test:e2e` (`[backlog: script test:e2e]`) when flows change, and any affected `pnpm verify:<area>` (`[backlog: script verify:<area>]`). `pnpm product:pull` reads `LINEAR_API_KEY` (a Linear personal API key) from the environment or a local, gitignored `.env.local` you create at the repo root.
- **Product source of truth:** business chapters 00-05 (`Product Vision 00 - Overview` through `Product Vision 05 - MVP Build Schedule & Validation Gates`) are Linear documents in project StreetThai, mirrored by `pnpm product:pull` into the generated, gitignored `.product-docs/` folder (index in its `README.md`); read the local mirror and re-run the script when the folder is missing or older than the current task needs. Technical chapters 06-09 live in `internal-docs/product-vision/0[6-9]-*`. Ignore the archived `Archive (v13) - *` drafts. A chapter beats the 00 Overview; a newer ADR in `docs/adr/` (`[backlog: docs/adr/]`) beats a chapter; ask the owner when two chapters disagree.
- **Domain language & ADRs:** use canonical terms from [`GLOSSARY.md`](GLOSSARY.md) and proactively correct the owner whenever they use an `_Avoid_` or conflicting term; record every design decision as a concise ADR in `docs/adr/` (`[backlog: docs/adr/]`) following `domain-modeling` and `internal-docs`.
- **Issue tracker:** Linear project [StreetThai](https://linear.app/tomasz-goral/project/streetthai-fab86ba18a16) (`P-TOM-1`, team `TOM`). Read the relevant issue before starting work and keep its status updated.

## Kill-conditions & formal verification

Load `formal-verify` whenever creating or modifying code behind any row below:

| Invariant | Harm prevented | Verification method | Command |
| :--- | :--- | :--- | :--- |
| Allergy & dietary Thai text is exact and intact | Mistranslated or truncated **Allergy Cards** can cause physical harm | Exhaustive catalog + serialization invariant test | `pnpm verify:allergy` `[backlog: script verify:allergy]` |
| Offline writes persist and replicate deterministically | Silent data loss or corruption at zero-signal street stalls | TLA+ model (RxDB/Dexie/Supabase outbox & reconnect); browser IndexedDB sync tests run in the Vitest `browser` project | `pnpm verify:sync` `[backlog: script verify:sync]` |
| 90-Day Thailand Pass never auto-renews or miscomputes expiry | Double-charging or wrong offline access cutoff | TLA+ state-machine check (purchase, activation, extension stacking, expiry, Offline Allowance) | `pnpm verify:entitlements` `[backlog: script verify:entitlements]` |
| Thai tones, Sound Spelling, Step-0 normalization, numeral verbalizer, and polite particles (`kráp`/`kâ`/`ká`) stay exact | Silent pedagogical or price-reading regressions | `fast-check` property tests + golden corpus against real G2P entry points | `pnpm verify:g2p` `[backlog: script verify:g2p]` |

## Thai content provenance

- `[enforced-by: tools/oxlint/rules/thai-literals.ts]` Thai Unicode literals live only in `src/content/**`, `packages/*/lib/data/**`, `packages/nlp/lib/prompts/**`, `**/tests/**`, `**/*.test.{ts,tsx}`, and `e2e/**`; keep Thai lexical tables (numerals, acronyms, currency markers) in `lib/data/`.
- `[enforced-by: .dependency-cruiser.cjs rule inferred-thai-render-path]` Render Inferred Thai only through the `InferredThai` render path (Beta Tone Card UI, `internal-docs/product-vision/09-*`).

## Layout & test routing

```text
apps/
  web/                # [backlog: apps/web/] Next.js PWA
    app/              # Next.js routes & layouts (composition root)
    components/       # Shared UI components
packages/
  config/             # Shared tsconfig, OXLint, and OXfmt config (`@streetthai/config`)
  ui/                 # Design tokens and shared UI primitives (`@streetthai/ui`)
  <name>/             # Deep domain modules
    index.ts          # Public entry point (any root file in a package is public)
    lib/              # Private implementation (data/, parse/)
    tests/            # Package tests & fixtures (private)
tests/                # Repo-level tests workspace (`@streetthai/tests`)
src/content/          # [backlog: src/content/] Audited Thai, Sound Spelling, allergy data, and fixtures/
e2e/                  # [backlog: e2e/] Playwright Test flow specs
specs/tla/            # [backlog: specs/tla/] TLA+ models
scripts/g2p/          # [backlog: scripts/g2p/] Build-time Python/TLTK G2P Trie compiler
tools/oxlint/         # [backlog: tools/oxlint/] Custom repo-local lint plugins
```

- **Deep-module boundaries (`[enforced-by: .dependency-cruiser.cjs rule deep-module-boundaries]` + `[enforced-by: .dependency-cruiser.cjs rule fixtures-test-only]` + `[enforced-by: .dependency-cruiser.cjs rule no-circular]`):** `lib/` imports freely within its package; external code and `tests/` import only root entry files; package tests live only in `packages/<name>/tests/`; only tests import `src/content/fixtures/`; zero cycles.
- **Property-test entry points:** expose domain operations (such as `syllabify`, `deriveTone`) on a package entry point when property tests need them.
- **`*.test.ts` (excluding `*.browser.test.ts` and `*.verify.test.ts`) -> Vitest `node` project (`[enforced-by: tools/vitest/suite-budget-reporter.ts]`):** pure domain logic, G2P, `fast-check` with a fixed `seed`, and fast invariant tests; CI suite total `< 5s` (enforced at suite level, never as a per-test timeout).
- **`*.verify.test.ts` -> Vitest `verify` project (`[backlog: script verify:<area>]` + `[enforced-by: .github/workflows/verify.yml]`):** invoked only via `pnpm verify:<area>` where `<area>` is the filename prefix (e.g. `allergy.verify.test.ts`), run in CI on changes to covered paths.
- **`*.test.tsx` and `*.browser.test.ts` -> Vitest `browser` project (`[enforced-by: tools/vitest/suite-budget-reporter.ts]`):** Playwright Chromium headless with `timezoneId: "UTC"`, `locale: "en-US"`, `reducedMotion: "reduce"`, and a fixed clock via a `setClock` browser command (`page.clock`, `[backlog: tools/vitest/set-clock.ts]`) for UI and real IndexedDB/Dexie/RxDB (never `jsdom` or `happy-dom`); CI suite total `< 30s`.
- **`e2e/*.spec.ts` -> Playwright Test (`[backlog: playwright.config.ts]`):** same context options as `browser`; CI suite total `< 60s` (`globalTimeout: 60_000`).

## Checks awaiting tooling

- **Zero flakiness:** keep `retry: 0` in `vitest.config.ts`, `retries: 0` and `forbidOnly: true` in Playwright (`[backlog: playwright.config.ts]`), and ban `.only`, `.skip`, `.todo`, and `page.waitForTimeout` in `packages/config/oxlintrc.json`.
- **Zero network in tests:** fail any request to a non-localhost origin in Vitest (`tools/vitest/localhost-only-fetch.ts` for `node`, the CSP header in `vitest.config.ts` for `browser`) and Playwright (`[backlog: e2e/network-guard.ts]`); inject fake AI, sync, and payment adapters.
- **Zero module mocking (`[enforced-by: tools/oxlint/rules/no-vi-mock.ts]`):** ban `vi.mock`, `vi.doMock`, `vi.importMock`, `vi.spyOn`, `vi.stubGlobal`, `vi.stubEnv`, `vi.useFakeTimers`, and `vi.setSystemTime`; pass fakes and adapters through function parameters.
- **No ambient nondeterminism (`[enforced-by: tools/oxlint/rules/no-ambient-nondeterminism.ts]`):** ban `Date.now`, `Date()`, `new Date()`, `performance.now`, `Temporal.Now`, `Math.random`, `crypto.randomUUID`, and `crypto.getRandomValues` in `packages/**` and `apps/web/components/**`; inject clocks and ID generators from `apps/web/app/**`.
- **Strict typing (`[enforced-by: tools/oxlint/rules/strict-typing.ts]`):** keep `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` in `packages/config/tsconfig.base.json` and `any` and non-null assertions (`x!`) banned in `packages/config/oxlintrc.json`; accept `unknown` only in input parsers (`packages/*/lib/parse/**` or `*.parse.ts`, narrowed with Zod) and `catch` clauses; write no `as` casts, except `as const` or an unavoidable `as` directly below `// SAFETY: <invariant>`.
- **Zero explanatory comments (`[enforced-by: tools/oxlint/rules/no-explanatory-comments.ts]`):** exempt generated files (`next-env.d.ts`); ban lint and TS suppressions (`oxlint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`); keep only legal headers, public-API doc comments, `// PLATFORM: <link or dep@version>`, `// SAFETY:`, and `// SHORTCUT: <ceiling>; <upgrade trigger>` (`PLATFORM`, `SAFETY`, and `SHORTCUT`: max 2 lines each; replace `TODO`/`FIXME` with `SHORTCUT:` or delete).
- **Public API first (`[enforced-by: tools/oxlint/rules/member-order.ts]`):** exports before non-exported declarations (except non-exported `const`, `let`, or `class` declarations an exported initializer reads at module load); class members public, protected, private.
- **E2E flow budget (`[enforced-by: tools/oxlint/rules/e2e-flow-budget.ts]`):** name each spec `e2e/<flow>.spec.ts` with `<flow>` from the rule's allowlist (`internal-docs/product-vision/07-*` sections 1-4 plus chapter 05 F3 Capture from `.product-docs/`) and max 1 `page.goto` per spec.
- **`AGENTS.md` freshness (`[enforced-by: tests/agents-md.test.ts]`):** fail if any `[backlog: <target>]` or `[enforced-by: <target>]` target already exists while its tag remains, if any untagged path/glob, `pnpm <script>`, or skill referenced here is missing, or if any `disable-model-invocation: true` skill in `.agents/skills/` is unlisted.

## Unautomatable rules

- **Curated Thai provenance:** source hand-written learner-facing Thai, Sound Spelling, and allergy copy from `src/content/` (`[backlog: src/content/]`) only; flag missing curated phrases to the owner instead of authoring or machine-translating them.
- **Flaky test resolution:** fix root causes or refactor onto deterministic parameters/adapters, and replace an unfixable test with a deterministic one covering the same behavior (delete coverage only with owner approval), instead of inflating timeouts.
- **Property test regressions:** commit every failing `fast-check` seed and counterexample path as a fixed regression test in the Vitest `node` project.
- **Literal unions:** derive literal unions from their typed source of truth instead of retyping them by hand.
- **Never weaken a check:** fix the code instead of loosening `oxlint`, TypeScript, `dependency-cruiser`, Vitest, or Playwright config or deleting tests (except as **Flaky test resolution** allows).

## Interrupt order

Flaky test > red check (any `pnpm check`, `pnpm test:e2e` `[backlog: script test:e2e]`, or `pnpm verify:*` `[backlog: script verify:<area>]` failure) > requested task.

When a higher-priority failure surfaces outside your current task, stop, report it to the owner, and fix it as a separate change before resuming the task.

## Skills

Skill overrides (`.agents/skills/`):

- `design-taste-frontend` - marketing routes under `apps/web/app/(marketing)/**` (`[backlog: apps/web/app/(marketing)/]`) only, never in-app PWA screens.
- `break-ui` - include long Thai strings (imported from `src/content/fixtures/` `[backlog: src/content/fixtures/]` into a `*.test.tsx` browser test, never a route or toggle), stacked tone marks/diacritics, empty states, and 360px viewports.
- `code-review` - fixed point `main` (or the stacked base branch), spec = the Linear issue in `StreetThai`, then its governing chapter (00-05 from the generated `.product-docs/` mirror, 06-09 from `internal-docs/product-vision/`); run on the branch diff before handoff.

User-run commands (`disable-model-invocation: true`; suggest to the owner when relevant): `/add-rule`, `/no-comments`, `/grill-with-docs`, `/retro`, `/improve-codebase-architecture`, `/pick-ui-library`, `/to-linear-task`, `/to-subtasks`, `/take-subtasks-to-pr`.
