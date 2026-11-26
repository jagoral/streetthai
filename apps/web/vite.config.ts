import { designTokens } from "@streetthai/ui";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { TanStackNitroPWAPlugin } from "@vite-pwa/tanstack/vite/nitro";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { APP_TAGLINE } from "./src/app-tagline.ts";

/**
 * Routes prerendered to static HTML so the service worker can precache them as the offline shell.
 */
export const prerenderedRoutes = ["/", "/settings"] as const;

/**
 * TanStack Start options: prerenders exactly the declared routes, without crawling links.
 */
export const tanstackStartOptions = {
  prerender: { enabled: true, crawlLinks: false },
  pages: prerenderedRoutes.map((path) => ({ path })),
} satisfies Parameters<typeof tanstackStart>[0];

/**
 * Nitro options: every prerendered route is also a Nitro prerender route rule.
 */
export const nitroOptions = {
  routeRules: Object.fromEntries(prerenderedRoutes.map((path) => [path, { prerender: true }])),
} satisfies Parameters<typeof nitro>[0];

/**
 * Options for `@vite-pwa/tanstack`: the web app manifest and the Workbox `generateSW` precache.
 */
export const pwaOptions = {
  strategies: "generateSW",
  registerType: "autoUpdate",
  includeManifestIcons: false,
  manifest: {
    name: "StreetThai",
    short_name: "StreetThai",
    description: APP_TAGLINE,
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: designTokens.color.accent,
    background_color: designTokens.color.surface,
    icons: [
      { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  },
  generateSW: {
    globPatterns: ["**/*.{js,css,html,png}"],
    // PLATFORM: @vite-pwa/tanstack@0.0.5 maps a nested a/b/index.html to precache URL `a`, so the
    // service worker never activates; map every nested index.html to its directory first.
    manifestTransforms: [
      async (entries) => ({
        manifest: entries.map((entry) => ({
          ...entry,
          url: entry.url.replace(/^(.+)\/index\.html$/, "$1"),
        })),
        warnings: [],
      }),
    ],
  },
} satisfies Parameters<typeof TanStackNitroPWAPlugin<"generateSW", "classic">>[0];

export default defineConfig({
  ssr: { noExternal: ["@vite-pwa/tanstack"] },
  plugins: [
    tanstackStart(tanstackStartOptions),
    nitro(nitroOptions),
    viteReact(),
    TanStackNitroPWAPlugin(pwaOptions),
  ],
});
