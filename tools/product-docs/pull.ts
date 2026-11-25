import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchProjectDocuments } from "./fetch-project-documents.ts";
import { renderMirror } from "./render-mirror.ts";

const streetThaiProjectId = "7465c972-803f-4cbd-ace9-4b7416aa0a1c";
const outputDir = join(import.meta.dirname, "../../.product-docs");

const apiKey = process.env["LINEAR_API_KEY"]?.trim() ?? "";
if (apiKey === "") {
  process.exitCode = 1;
  console.error(
    [
      "LINEAR_API_KEY is not set.",
      "Create a personal API key in Linear > Settings > Security & access > Personal API keys,",
      "then add `LINEAR_API_KEY=lin_api_...` to .env.local at the repo root (gitignored) or export it in your shell.",
    ].join("\n"),
  );
} else {
  try {
    const docs = await fetchProjectDocuments({ fetch, apiKey, projectId: streetThaiProjectId });
    await writeMirror(renderMirror(docs));
    console.log(`Mirrored ${docs.length} Linear documents into .product-docs/`);
  } catch (error) {
    process.exitCode = 1;
    console.error(error instanceof Error ? error.message : String(error));
  }
}

async function writeMirror(files: ReadonlyMap<string, string>): Promise<void> {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await Promise.all(
    [...files].map(([fileName, content]) => writeFile(join(outputDir, fileName), content)),
  );
}
