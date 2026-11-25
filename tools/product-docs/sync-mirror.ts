import {
  fetchProjectDocumentMetadata,
  fetchProjectDocuments,
  type FetchProjectDocumentsOptions,
} from "./fetch-project-documents.ts";
import type { MirrorState } from "./mirror-state.parse.ts";
import { hasChanged, isFresh } from "./mirror-state.ts";
import { renderMirror } from "./render-mirror.ts";

export type MirrorStore = {
  readState: () => Promise<MirrorState | null>;
  writeState: (state: MirrorState) => Promise<void>;
  replaceMirror: (files: ReadonlyMap<string, string>, state: MirrorState) => Promise<void>;
};

export type SyncMirrorOptions = FetchProjectDocumentsOptions & {
  store: MirrorStore;
  now: Date;
  maxAgeMs: number;
  force: boolean;
};

export type SyncResult =
  | { kind: "fresh" }
  | { kind: "unchanged" }
  | { kind: "refreshed"; documentCount: number };

export async function syncMirror(options: SyncMirrorOptions): Promise<SyncResult> {
  const state = options.force ? null : await options.store.readState();
  if (isFresh(state, options.now, options.maxAgeMs)) {
    return { kind: "fresh" };
  }
  if (state !== null && !hasChanged(state, await fetchProjectDocumentMetadata(options))) {
    await options.store.writeState({ ...state, checkedAt: options.now.toISOString() });
    return { kind: "unchanged" };
  }
  const docs = await fetchProjectDocuments(options);
  await options.store.replaceMirror(renderMirror(docs), {
    checkedAt: options.now.toISOString(),
    documents: Object.fromEntries(docs.map((doc) => [doc.id, doc.updatedAt])),
  });
  return { kind: "refreshed", documentCount: docs.length };
}
