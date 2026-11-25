import type { DocumentMeta } from "./linear-documents.parse.ts";
import type { MirrorState } from "./mirror-state.parse.ts";

export function isFresh(state: MirrorState | null, now: Date, maxAgeMs: number): boolean {
  if (state === null) {
    return false;
  }
  return now.getTime() - Date.parse(state.checkedAt) < maxAgeMs;
}

export function hasChanged(state: MirrorState | null, metadata: readonly DocumentMeta[]): boolean {
  if (state === null) {
    return true;
  }
  const known = Object.entries(state.documents);
  if (known.length !== metadata.length) {
    return true;
  }
  const current = new Map(metadata.map((doc) => [doc.id, doc.updatedAt]));
  return known.some(([id, updatedAt]) => current.get(id) !== updatedAt);
}
