import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseMirrorState, type MirrorState } from "./mirror-state.parse.ts";
import { syncMirror, type MirrorStore, type SyncResult } from "./sync-mirror.ts";

const streetThaiProjectId = "7465c972-803f-4cbd-ace9-4b7416aa0a1c";
const outputDir = join(import.meta.dirname, "../../.product-docs");
const stateFile = join(outputDir, ".state.json");
const maxAgeMs = 60 * 60 * 1000;
const ifStaleTimeoutMs = 20_000;

const ifStale = process.argv.includes("--if-stale");
const apiKey = process.env["LINEAR_API_KEY"]?.trim() ?? "";

if (apiKey === "") {
  fail(
    "LINEAR_API_KEY is not set, .product-docs/ was not refreshed.",
    [
      "LINEAR_API_KEY is not set.",
      "Create a personal API key in Linear > Settings > Security & access > Personal API keys,",
      "then add `LINEAR_API_KEY=lin_api_...` to .env.local at the repo root (gitignored) or export it in your shell.",
    ].join("\n"),
  );
} else {
  try {
    const result = await syncMirror({
      fetch: ifStale
        ? (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(ifStaleTimeoutMs) })
        : fetch,
      apiKey,
      projectId: streetThaiProjectId,
      store: fileStore(),
      now: new Date(),
      maxAgeMs,
      force: !ifStale,
    });
    report(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`product docs not refreshed (${message.split("\n")[0]}).`, message);
  }
}

function report(result: SyncResult): void {
  if (result.kind === "refreshed") {
    console.log(`product docs refreshed: ${result.documentCount} documents in .product-docs/`);
  }
}

function fail(ifStaleWarning: string, fullModeError: string): void {
  if (ifStale) {
    console.log(`warning: ${ifStaleWarning}`);
    return;
  }
  process.exitCode = 1;
  console.error(fullModeError);
}

function fileStore(): MirrorStore {
  return {
    readState: async () => {
      try {
        return parseMirrorState(await readFile(stateFile, "utf8"));
      } catch {
        return null;
      }
    },
    writeState,
    replaceMirror: async (files, state) => {
      await rm(outputDir, { recursive: true, force: true });
      await mkdir(outputDir, { recursive: true });
      await Promise.all(
        [...files].map(([fileName, content]) => writeFile(join(outputDir, fileName), content)),
      );
      await writeState(state);
    },
  };
}

async function writeState(state: MirrorState): Promise<void> {
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`);
}
