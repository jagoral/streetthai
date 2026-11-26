import assert from "node:assert/strict";
import { existsSync, globSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPackageDir = join(repoRoot, "packages/config");
const strictOptions = ["strict", "noUncheckedIndexedAccess", "exactOptionalPropertyTypes"];
const checkScripts = ["typecheck", "lint", "fmt:check"];

test("packages/config exports the strict base tsconfig, OXLint and OXfmt config", () => {
  const manifest = readJson(join(configPackageDir, "package.json"));
  assert.equal(manifest["name"], "@streetthai/config");

  const exportsMap = asRecord(manifest["exports"]);
  for (const subpath of ["./tsconfig.json", "./oxlintrc.json", "./oxfmtrc.json"]) {
    const target = exportsMap[subpath];
    assert.equal(typeof target, "string", `missing export ${subpath}`);
    assert.ok(
      existsSync(join(configPackageDir, String(target))),
      `export ${subpath} points nowhere`,
    );
  }

  const compilerOptions = asRecord(
    readJson(join(configPackageDir, String(exportsMap["./tsconfig.json"])))["compilerOptions"],
  );
  for (const option of strictOptions) {
    assert.equal(compilerOptions[option], true, `base tsconfig must enable ${option}`);
  }
});

test("every workspace extends the shared config without redefining the strict options", () => {
  const workspaces = listWorkspaces().filter((dir) => dir !== configPackageDir);
  assert.ok(workspaces.includes(join(repoRoot, "packages/ui")), "packages/ui workspace is missing");

  for (const dir of [repoRoot, ...workspaces]) {
    const name = relative(repoRoot, dir) || "<root>";
    const tsconfig = readJson(join(dir, "tsconfig.json"));
    assert.equal(tsconfig["extends"], "@streetthai/config/tsconfig.json", `${name} tsconfig`);
    const compilerOptions = asRecord(tsconfig["compilerOptions"] ?? {});
    for (const option of strictOptions) {
      assert.ok(!(option in compilerOptions), `${name} tsconfig redefines ${option}`);
    }

    const oxlintrc = readJson(join(dir, ".oxlintrc.json"));
    assert.deepEqual(
      oxlintrc["extends"],
      ["./node_modules/@streetthai/config/oxlintrc.json"],
      `${name} .oxlintrc.json`,
    );

    const devDependencies = asRecord(readJson(join(dir, "package.json"))["devDependencies"]);
    assert.equal(devDependencies["@streetthai/config"], "workspace:*", `${name} devDependencies`);
  }
});

test("every workspace exposes the typecheck, lint and fmt:check tasks that pnpm check runs", () => {
  const rootScripts = asRecord(readJson(join(repoRoot, "package.json"))["scripts"]);
  assert.equal(rootScripts["check"], "turbo run typecheck lint fmt:check test:node test:browser");

  for (const dir of [repoRoot, ...listWorkspaces()]) {
    const scripts = asRecord(readJson(join(dir, "package.json"))["scripts"]);
    const expected = dir === configPackageDir ? ["fmt:check"] : checkScripts;
    for (const script of expected) {
      assert.equal(
        typeof scripts[script],
        "string",
        `${relative(repoRoot, dir) || "<root>"} lacks ${script}`,
      );
    }
  }
});

test("apps/web is a workspace that builds through turbo and CI", () => {
  const webDir = join(repoRoot, "apps/web");
  assert.ok(listWorkspaces().includes(webDir), "apps/web workspace is missing");

  const scripts = asRecord(readJson(join(webDir, "package.json"))["scripts"]);
  for (const script of [...checkScripts, "fmt", "build"]) {
    assert.equal(typeof scripts[script], "string", `apps/web lacks ${script}`);
  }

  const turboTasks = asRecord(readJson(join(repoRoot, "turbo.json"))["tasks"]);
  assert.ok("build" in turboTasks, "turbo.json lacks a build task");
  assert.equal(
    asRecord(readJson(join(repoRoot, "package.json"))["scripts"])["build"],
    "turbo run build",
  );
  assert.match(
    readFileSync(join(repoRoot, ".github/workflows/ci.yml"), "utf8"),
    /run: pnpm check\n\s+- run: pnpm build\n/,
  );
});

test("the pnpm catalog pins TanStack Start, Nitro and Vite to exact versions", () => {
  const manifest = readFileSync(join(repoRoot, "pnpm-workspace.yaml"), "utf8");
  for (const name of ["@tanstack/react-start", "@tanstack/react-router", "nitro", "vite"]) {
    const pattern = new RegExp(`^ {2}"?${name.replace("/", "\\/")}"?: (\\S+)$`, "m");
    const version = manifest.match(pattern)?.[1];
    assert.ok(version !== undefined, `catalog lacks ${name}`);
    assert.match(version, /^\d+\.\d+\.\d+(-[\w.]+)?$/, `${name} is not pinned exactly`);
  }

  const webManifest = readJson(join(repoRoot, "apps/web/package.json"));
  const webDependencies = {
    ...asRecord(webManifest["dependencies"]),
    ...asRecord(webManifest["devDependencies"]),
  };
  for (const name of ["@tanstack/react-start", "nitro", "vite"]) {
    assert.equal(webDependencies[name], "catalog:", `apps/web must take ${name} from the catalog`);
  }
});

function listWorkspaces(): string[] {
  const manifest = readFileSync(join(repoRoot, "pnpm-workspace.yaml"), "utf8");
  const globs = [...manifest.matchAll(/^ {2}- (\S+)$/gm)].map((match) => match[1] ?? "");
  return globs
    .flatMap((glob) => globSync(glob, { cwd: repoRoot }))
    .map((path) => join(repoRoot, path))
    .filter((dir) => existsSync(join(dir, "package.json")))
    .toSorted();
}

function readJson(path: string): Record<string, unknown> {
  return asRecord(JSON.parse(readFileSync(path, "utf8")));
}

function asRecord(value: unknown): Record<string, unknown> {
  assert.ok(
    typeof value === "object" && value !== null && !Array.isArray(value),
    "expected an object",
  );
  return Object.fromEntries(Object.entries(value));
}
