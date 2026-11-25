import { expect, test } from "vitest";
import { parseMirrorState } from "../mirror-state.parse.ts";
import { hasChanged, isFresh } from "../mirror-state.ts";

const hour = 60 * 60 * 1000;
const now = new Date("2026-11-16T12:00:00.000Z");

test("a well-formed state file parses, a corrupt or wrongly shaped one reads as no state", () => {
  const state = { checkedAt: "2026-11-16T11:30:00.000Z", documents: { "doc-1": "2026-11-10" } };

  expect(parseMirrorState(JSON.stringify(state))).toEqual(state);
  expect(parseMirrorState("{not json")).toBeNull();
  expect(parseMirrorState(JSON.stringify({ checkedAt: "yesterday", documents: {} }))).toBeNull();
  expect(parseMirrorState(JSON.stringify({ checkedAt: state.checkedAt }))).toBeNull();
});

test("a state checked less than max age ago is fresh, at or beyond it is stale", () => {
  expect(isFresh(checkedAt("2026-11-16T11:00:00.001Z"), now, hour)).toBe(true);
  expect(isFresh(checkedAt("2026-11-16T11:00:00.000Z"), now, hour)).toBe(false);
  expect(isFresh(null, now, hour)).toBe(false);
});

test("the mirror changed when a document was added, removed, or updated, or there is no state", () => {
  const state = { checkedAt: "2026-11-16T11:00:00.000Z", documents: { a: "t1", b: "t2" } };

  expect(hasChanged(state, metadata({ b: "t2", a: "t1" }))).toBe(false);
  expect(hasChanged(state, metadata({ a: "t1", b: "t3" }))).toBe(true);
  expect(hasChanged(state, metadata({ a: "t1" }))).toBe(true);
  expect(hasChanged(state, metadata({ a: "t1", b: "t2", c: "t4" }))).toBe(true);
  expect(hasChanged(state, metadata({ a: "t1", c: "t2" }))).toBe(true);
  expect(hasChanged(null, metadata({}))).toBe(true);
});

function checkedAt(iso: string) {
  return { checkedAt: iso, documents: {} };
}

function metadata(updatedAtById: Record<string, string>) {
  return Object.entries(updatedAtById).map(([id, updatedAt]) => ({ id, updatedAt }));
}
