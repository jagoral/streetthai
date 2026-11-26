import assert from "node:assert/strict";
import { existsSync, globSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(repoRoot, "apps/web/.output");
const databaseMarkers = {
  rxdb: /rxdb\.info|createRxDatabase/,
  dexie: /DatabaseClosedError/,
};

test("the apps/web production server output carries no RxDB or Dexie code", () => {
  const server = readBundle("server/**/*.mjs");
  const client = readBundle("public/**/*.js");

  for (const [library, marker] of Object.entries(databaseMarkers)) {
    assert.match(client, marker, `the client bundle should load ${library}`);
    assert.doesNotMatch(server, marker, `the server bundle must not contain ${library}`);
  }
});

function readBundle(pattern: string): string {
  assert.ok(
    existsSync(outputDir),
    "apps/web/.output is missing; run this test through turbo (pnpm check), which builds apps/web first",
  );
  const files = globSync(pattern, { cwd: outputDir });
  assert.ok(files.length > 0, `no ${pattern} files in apps/web/.output`);
  return files.map((file) => readFileSync(join(outputDir, file), "utf8")).join("\n");
}
