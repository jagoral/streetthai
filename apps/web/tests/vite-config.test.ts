import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import viteConfig, {
  nitroOptions,
  prerenderedRoutes,
  pwaOptions,
  tanstackStartOptions,
} from "../vite.config.ts";

const webDir = new URL("../", import.meta.url);

test("@vite-pwa/tanstack is pinned exactly in the catalog with its undeclared peers as devDependencies", () => {
  const catalog = readFileSync(new URL("../../pnpm-workspace.yaml", webDir), "utf8");
  for (const name of ["@vite-pwa/tanstack", "@unplugin-pwa/core", "magicast"]) {
    const version = catalog.match(new RegExp(`^ {2}"?${name}"?: (\\S+)$`, "m"))?.[1];
    expect(version, `catalog pins ${name}`).toMatch(/^\d+\.\d+\.\d+$/);
  }
  expect(catalog).toMatch(/^ {2}"@vite-pwa\/tanstack": 0\.0\.5$/m);

  const manifest: { devDependencies: Record<string, string> } = JSON.parse(
    readFileSync(new URL("package.json", webDir), "utf8"),
  );
  expect(manifest.devDependencies).toMatchObject({
    "@vite-pwa/tanstack": "catalog:",
    "@unplugin-pwa/core": "catalog:",
    magicast: "catalog:",
  });
});

test("the PWA plugin bundles into SSR and generates a Workbox service worker without manifest icons", () => {
  expect(viteConfig.ssr?.noExternal).toEqual(["@vite-pwa/tanstack"]);
  expect(pwaOptions).toMatchObject({
    strategies: "generateSW",
    registerType: "autoUpdate",
    includeManifestIcons: false,
  });
});

test("the nested index.html workaround maps a/b/index.html to a/b under a PLATFORM comment", async () => {
  const [transform] = pwaOptions.generateSW.manifestTransforms;
  assert.ok(transform, "a manifest transform is configured");
  const entries = ["index.html", "settings/index.html", "a/b/index.html", "assets/x.js"].map(
    (url) => ({ url, revision: null, size: 0 }),
  );

  const result = await transform(entries);

  expect(result.manifest.map(({ url }) => url)).toEqual([
    "index.html",
    "settings",
    "a/b",
    "assets/x.js",
  ]);
  expect(readFileSync(new URL("vite.config.ts", webDir), "utf8")).toMatch(
    /\/\/ PLATFORM: @vite-pwa\/tanstack@0\.0\.5 .*\n.*\n\s+manifestTransforms:/,
  );
});

test("every prerendered route is declared in both Nitro routeRules and tanstackStart pages", () => {
  expect(prerenderedRoutes).toContain("/");
  expect(tanstackStartOptions.prerender).toEqual({ enabled: true, crawlLinks: false });
  expect(tanstackStartOptions.pages.map(({ path }) => path)).toEqual([...prerenderedRoutes]);
  expect(Object.keys(nitroOptions.routeRules)).toEqual([...prerenderedRoutes]);
  for (const rule of Object.values(nitroOptions.routeRules)) {
    expect(rule).toEqual({ prerender: true });
  }
});
