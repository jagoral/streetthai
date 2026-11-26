# TanStack Start is the frontend framework for `apps/web`

StreetThai builds its one PWA in `apps/web/` on TanStack Start (`@tanstack/react-start` 1.169.7 at spike time, on Vite 8 + Nitro 3 RC, Vercel preset pinned to `fra1`), not Next.js 16.4.6. The [TOM-7](https://linear.app/tomasz-goral/issue/TOM-7) spike built the same throwaway app against `@streetthai/db` in both frameworks ([TOM-13](https://linear.app/tomasz-goral/issue/TOM-13) Next.js, [TOM-14](https://linear.app/tomasz-goral/issue/TOM-14) TanStack Start), checked both on a real iPhone ([TOM-15](https://linear.app/tomasz-goral/issue/TOM-15)), and scored them on the TOM-7 rubric. The handoff comments on those issues hold the raw evidence; no spike code was merged.

## The rubric ties, and fit with this app decides

TOM-7 scores seven criteria from 0 to 3 against written anchors (listed on the issue), weighted to a maximum of 48. C1-C4 are Hard Gates (a 0 disqualifies), C5-C7 are not, and rule R3 sends an exact tie to TanStack Start because the rest of the stack is TanStack.

| ID | Criterion (weight) | Next.js | TanStack Start |
| -- | -- | -- | -- |
| C1 | Static SEO prerendering (x2) | 3 | 2 |
| C2 | Offline PWA shell + iOS A2HS (x3) | 2 | 2 |
| C3 | `@streetthai/db` reactivity + client boundary (x3) | 3 | 3 |
| C4 | Vercel `fra1` route + streaming (x2) | 2 | 2 |
| C5 | Monorepo toolchain, TS 7 + OXLint (x2) | 2 | 2 |
| C6 | Capacitor static bundle (x2) | 2 | 3 |
| C7 | Solo-builder DX + build speed (x2) | 2 | 2 |
| | **Weighted total (max 48)** | **37** | **37** |

Neither framework hit a Hard Gate 0. TanStack Start's C1 is 2 because each prerendered route is declared in both Nitro `routeRules` and the Start config. Both C5 scores are 2: Next.js needs `next typegen` for `.next/types`, and TanStack Start's generated `routeTree.gen.ts` needs a generated-file exemption. C6 is TanStack Start's only clear rubric win: `NITRO_PRESET=static` builds the Capacitor bundle with no config change, while Next.js `output: "export"` fails while an API route exists and needs a file-rename convention plus a second `pageExtensions` mode that silently drops its rewrites and headers.

Moving any weight-2 criterion by one step (two weighted points) moves this result, so the score is a near-tie, not a verdict. Readings range from Next.js 37 to 34 (TanStack Start C2 read as 1, because its service worker never activates without the `manifestTransforms` workaround) up to TanStack Start 39 to 37 (its C1 read as 3, since the second declaration exists only for the PWA plugin). Reading both C2 scores as 1 gives 34 to 34, which R3 sends to TanStack Start. The one-sided C2 reading was rejected because Next.js needed equal intervention to work offline: custom `additionalPrecacheEntries`, a `/sw.js` rewrite with hand-written `headers()`, and disabling the default `reloadOnOnline`, which otherwise broke offline navigation.

What decides it is the shape of this app, which the rubric does not weigh:

- **Offline navigation.** Most screens are client-rendered over local RxDB data, and learners use them offline at a street stall. In the desktop offline runs, TanStack Start completed every link with 0 failed requests. Next.js App Router could not fetch its RSC payloads, so each offline link tap fell back to a full page reload from the precache, logging 9-17 failed `_rsc` requests per run. Both apps passed the iPhone check, so nothing breaks, but on Next.js every offline tap is a full reload, which means the screen blanks, in-memory state is lost, and RxDB reopens (the expected effect of a reload, not measured in the spike). The TanStack Start result holds only while offline routes avoid server-function loaders, which the "Database stays client-only" consequence below keeps true. React Server Components only help the few SEO dish pages, which is the one criterion (C1) where Next.js scored higher.
- **TanStack ecosystem fit.** `@streetthai/db` is TanStack DB, and the app will add more TanStack packages such as TanStack Query. TanStack Router's type-safe loaders and search params share that model. Start server routes return a standard `ReadableStream`, which streamed three chunks about 300 ms apart from `fra1` (as did Next.js), so either the Vercel AI SDK named in `AGENTS.md` or TanStack AI can stream through them. This fit was not spiked. It is the same consideration R3 already encodes, not a second independent reason, so the qualitative case rests mainly on offline navigation.

Both frameworks can render a route client-only (`next/dynamic({ ssr: false })` in Next.js, route `ssr: false` in Start). The difference is C6: Start's SPA shell (`spa: { enabled: true }`) and static preset build alongside its server routes without a second build mode.

## Both apps worked offline on a real iPhone

Installed with Add to Home Screen in standalone mode and run in Airplane Mode, both apps handled `/` to `/dishes/pad-kra-pao` and back, a reload, and the `kráp`/`kâ` toggle. The Next.js home-screen icon rendered as a blank tile, most likely because the spike shipped no `apple-touch-icon` (iOS ignores manifest icons). That is a setup gap either framework can hit, so it is not scored, and `apps/web` ships an `apple-touch-icon` either way.

![iOS home screen: TanStack Start icon shows "ST" on red, Next.js icon is a blank tile](./assets/0001-ios-a2hs-icons.png)

## What choosing TanStack Start gives up

Next.js is the more mature, Vercel-native option with the larger ecosystem and documentation, and it had the cleaner prerender API (C1). TanStack Start itself is on a stable 1.x line, but two dependencies around it are not: Nitro v3 is a release candidate and `@vite-pwa/tanstack` is 0.0.5 with a bug that silently breaks the service worker. That immaturity is the main cost accepted here.

Revisit this decision if any of these happen:

- TanStack Start or its PWA path hits a Hard Gate blocker in `apps/web`.
- `@vite-pwa/tanstack` stays unfixed and plain `vite-plugin-pwa` cannot replace it.
- A Nitro v3 release breaks the Vercel `fra1` preset or streaming.
- The Capacitor shell cannot call the `fra1` API by absolute URL, or Capacitor leaves the roadmap (removing C6, TanStack Start's one rubric win).
- Next.js gains working offline client navigation, for example by precaching RSC payloads.

## Consequences

- **PWA plugin precache bug:** `@vite-pwa/tanstack@0.0.5` maps a nested `a/b/index.html` to precache URL `a`, so the service worker installs but never activates. `apps/web` ([TOM-8](https://linear.app/tomasz-goral/issue/TOM-8)) carries this `generateSW.manifestTransforms` entry under a `// PLATFORM: @vite-pwa/tanstack@0.0.5` comment, drops it after a fixed release, and has a test asserting `navigator.serviceWorker.controller` is set after install. Plain `vite-plugin-pwa` with Workbox is the fallback if the plugin stalls.

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

- **Undocumented PWA setup:** `apps/web` also needs `ssr.noExternal: ["@vite-pwa/tanstack"]` (without it prerender renders 0 routes), `magicast` and `@unplugin-pwa/core` as direct devDependencies, and `includeManifestIcons: false`.
- **Double prerender declaration:** list each prerendered route in both Nitro `routeRules` (`prerender: true`) and `tanstackStart({ prerender, pages })`.
- **Database stays client-only:** the spike's SSR bundle carried RxDB and Dexie (319 kB) into the `fra1` function and rendered the default `kráp` before the stored setting loaded. Database-backed routes use `ssr: false` and load `@streetthai/db` through a dynamic import in the client hook, so it leaves the server bundle; TOM-8 checks the server output no longer contains RxDB. Either framework would need this boundary, so it does not change C3.
- **Pinned versions:** pin Nitro and `@vite-pwa/tanstack` exactly through the pnpm catalog and upgrade deliberately.
- **Untested paths:** the TanStack Start deploy was a local build pushed with `vercel deploy --prebuilt`; a Vercel git build was not tried. A Capacitor shell must call the deployed `fra1` API by absolute URL with CORS, which the spike did not test.
