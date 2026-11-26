import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(repoRoot, "apps/web/.output/public");

test("the built service worker precaches every prerendered route, its client chunks and the icons", () => {
  const precached = precacheUrls();

  for (const url of ["/", "settings", "manifest.webmanifest", "apple-touch-icon.png"]) {
    assert.ok(precached.includes(url), `sw.js should precache ${url}`);
  }
  assert.ok(existsSync(join(publicDir, "index.html")), "/ should be prerendered");
  assert.ok(existsSync(join(publicDir, "settings/index.html")), "/settings should be prerendered");
  assert.ok(
    precached.some((url) => /^assets\/.+\.js$/.test(url)),
    "sw.js should precache the client chunks",
  );
  assert.deepEqual(
    precached.filter((url) => url.endsWith(".html")),
    [],
    "precached HTML is keyed by its route",
  );
});

function precacheUrls(): string[] {
  return [...readServiceWorker().matchAll(/url:\s*[`"']([^`"']+)[`"']/g)].map(
    (match) => match[1] ?? "",
  );
}

function readServiceWorker(): string {
  const path = join(publicDir, "sw.js");
  assert.ok(
    existsSync(path),
    "apps/web/.output/public/sw.js is missing; run this test through turbo (pnpm check), which builds apps/web first",
  );
  return readFileSync(path, "utf8");
}
