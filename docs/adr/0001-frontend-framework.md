# TanStack Start is the frontend framework for `apps/web`

StreetThai builds its one PWA in `apps/web/` on TanStack Start (Vite + Nitro, Vercel preset pinned to `fra1`), not Next.js. A 1-day spike ([TOM-7](https://linear.app/tomasz-goral/issue/TOM-7)) built the same throwaway app in both frameworks against `@streetthai/db` and scored them on seven weighted criteria: TanStack Start scored 39/48 and Next.js 37/48, neither hit a Hard Gate blocker, and TanStack Start also wins the TOM-7 tie-break rule, so the result holds even if its one debatable 3 (C5) is read as a 2.

**Status:** accepted

## Both apps implemented the same four-route blueprint

Each throwaway app shipped `/` (home shell with the live `LearnerSettingsCollection` polite-particle toggle, `kráp`/`kâ`), a statically prerendered `/dishes/pad-kra-pao` with title, meta description, and one hydrated control, `/api/health` pinned to `fra1` with a `?stream=1` 3 x 300ms `ReadableStream`, and a manifest plus Workbox service worker. Raw, unscored evidence lives in the handoff comments on [TOM-13](https://linear.app/tomasz-goral/issue/TOM-13) (Next.js 16.4.6) and [TOM-14](https://linear.app/tomasz-goral/issue/TOM-14) (TanStack Start on Vite 8.3.8 + Nitro 3.0 RC). Both Vercel projects, worktrees, and branches were deleted after scoring; no spike code was merged.

## TanStack Start wins 39 to 37 on the weighted score

Scores use the TOM-7 0-3 anchors as written. A 0 on a Hard Gate (C1-C4) would disqualify; none occurred. All three Non-Gates (C5-C7) have comparable evidence for both frameworks, so none is excluded.

| ID | Criterion (weight) | Next.js | TanStack Start |
| -- | -- | -- | -- |
| C1 | Static SEO prerendering (x2) | **3** - built-in `generateStaticParams` + `generateMetadata`, build log `(SSG) prerendered as static HTML`, `x-vercel-cache: PRERENDER` then `HIT`, 0 hydration warnings | **2** - built-in `tanstackStart({ prerender })`, but Nitro `routeRules` `prerender: true` must also be declared, so prerender runs twice; HTML/meta present without JS, 0 hydration warnings |
| C2 | Offline PWA shell + iOS A2HS (x3) | **2** - maintained `@serwist/turbopack@9.6.0` with no webpack fallback, but needs a `/sw.js` rewrite plus custom `headers()` for Cache-Control, `reloadOnOnline={false}` to stop offline link clicks failing, and degrades to full-page loads with `_rsc` `net::ERR_FAILED` errors offline; iPhone offline nav passed, home-screen icon blank | **2** - maintained `@vite-pwa/tanstack@0.0.5`, but its precache bug (nested `index.html` mapped to `dishes`, SW never activates) needs a `manifestTransforms` workaround plus four undocumented steps (`ssr.noExternal`, `magicast`, `@unplugin-pwa/core`, `includeManifestIcons: false`); plugin sets `/sw.js` Cache-Control itself; iPhone offline nav passed, icon correct |
| C3 | `@streetthai/db` reactivity + client boundary (x3) | **3** - one `"use client"` component with stock `useLiveQuery`, no `next/dynamic`, no shims, offline reload and offline toggle persisted | **3** - one plain hook with stock `useLiveQuery`, no route `ssr: false` or `ClientOnly`, SSR renders default `kráp`, offline reload and offline toggle persisted |
| C4 | Vercel `fra1` route + streaming (x2) | **2** - `vercel.json` `regions: ["fra1"]` + `force-dynamic`; `x-vercel-id` `::fra1::`, chunks at +727/+1015/+1324ms | **2** - Nitro `vercel.functions.regions: ["fra1"]`; `λ __server [fra1]`, chunks at +707/+1012/+1307ms |
| C5 | Monorepo toolchain, TS 7 + OXLint (x2) | **2** - strict flags kept, but `tsc` needs `next typegen` first and `.next/types/**` included, the SW needs a separate webworker tsconfig, and `__SW_MANIFEST` needed an `injectionPoint` rename for `no-underscore-dangle` | **3** - `tsc --noEmit` and `oxlint --deny-warnings` pass with no excludes and no weakened flags (only normal `lib`/`jsx`/`types` settings) |
| C6 | Capacitor static bundle (x2) | **2** - `output: "export"` fails with `/api/health` present; passes only via a `STATIC_EXPORT` env mode that renames the route to `route.server.ts` and toggles `pageExtensions`, and export mode drops rewrites/headers | **3** - `NITRO_PRESET=static` builds with no config change and drops `/api/health`; a one-line `CAPACITOR=1` switch adds the SPA shell |
| C7 | Solo-builder DX + build speed (x2) | **2** - cold build 8.11s, warm 5.47s, dev ready 1.24s + first `curl` 3.22s (4.5s); recurring friction from `next dev` auto-writing `apps/<app>/AGENTS.md` | **2** - cold build 8.14s, warm 4.05s, dev ready 1.68s + first `curl` 0.77s (2.5s); not a 3 because dev drops clicks before hydration with no ready signal and pre-1.0 version skew recurs |
| | **Weighted total (max 48)** | **37** (6 + 6 + 9 + 4 + 4 + 4 + 4) | **39** (4 + 6 + 9 + 4 + 6 + 6 + 4) |

The margin comes from the Non-Gates: TanStack Start's first-class static preset (C6) and untouched toolchain pass (C5) outweigh Next.js's cleaner single-declaration prerender (C1). With TanStack Start's C5 read as a 2, the totals tie at 37 and the TOM-7 rule awards an exact tie to TanStack Start.

## The real-iPhone pass confirmed offline navigation in both apps

On 2026-11-26 the owner installed both apps with Add to Home Screen in standalone mode ([TOM-15](https://linear.app/tomasz-goral/issue/TOM-15)). In Airplane Mode both handled `/` to `/dishes/pad-kra-pao` and back, a reload, and the `kráp`/`kâ` toggle. The Next.js app's home-screen icon rendered as a blank tile with no "ST" glyph, while the TanStack Start icon rendered correctly. The blank icon counts against Next.js's C2 friction but is not a gate failure.

![iOS home screen: TanStack Start icon shows "ST" on red, Next.js icon is a blank tile](./assets/0001-ios-a2hs-icons.png)

## Next.js was rejected on static bundling and config friction

Next.js matched TanStack Start on every Hard Gate except C1, where it was better. It lost on C5 and C6. Its type-check depends on a `next typegen` step and generated `.next/types`. Its Phase 2 Capacitor build needs a file-rename convention and a second `pageExtensions` env mode, and that mode silently drops the rewrites and headers the service worker depends on. Its PWA path also carried more hidden behavior than TanStack Start's: the default `reloadOnOnline` broke offline navigation, RSC payloads are not precached, and the iOS icon came out blank. Revisit this choice only if TanStack Start or its PWA plugin develops a Hard Gate blocker in `apps/web`.

## Consequences

- **PWA plugin bug:** `@vite-pwa/tanstack@0.0.5` `createManifestTransform` maps a nested `a/b/index.html` to precache URL `a`, so the service worker installs but never activates. Until upstream fixes it, `apps/web` (TOM-8) must carry this `generateSW.manifestTransforms` entry under a `// PLATFORM: @vite-pwa/tanstack@0.0.5` comment and drop it after a fixed release:

  ```ts
  manifestTransforms: [
    async (entries) => ({
      manifest: entries.map((entry) => ({
        ...entry,
        url: entry.url.replace(/^(.+)\/index\.html$/, "$1"),
      })),
      warnings: [],
    }),
  ],
  ```

- **Undocumented PWA setup:** `apps/web` also needs `ssr.noExternal: ["@vite-pwa/tanstack"]` (otherwise prerender fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME ... 'virtual:'` and renders 0 routes), `magicast` and `@unplugin-pwa/core` as direct devDependencies, and `includeManifestIcons: false`.
- **Double prerender declaration:** list each prerendered route in both Nitro `routeRules` (`prerender: true`) and `tanstackStart({ prerender, pages })`, as the vite-pwa README requires; prerender runs twice per build.
- **Generated route tree:** `routeTree.gen.ts` is committed source carrying `/* eslint-disable */` and `// @ts-nocheck`, so the backlog `no-explanatory-comments` rule must exempt it, as the `AGENTS.md` rule now states.
- **Pre-1.0 dependencies:** Nitro v3 is an RC and `@vite-pwa/tanstack` is 0.0.5; pin exact versions through the pnpm catalog and upgrade deliberately.
- **Capacitor bundle:** server routes such as `/api/health` 404 in the static build, so a Phase 2 Capacitor shell must call the deployed `fra1` API by absolute URL; this was not tested in the spike.
