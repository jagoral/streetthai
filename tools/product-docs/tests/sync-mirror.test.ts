import { expect, test } from "vitest";
import type { MirrorState } from "../mirror-state.parse.ts";
import { syncMirror, type MirrorStore } from "../sync-mirror.ts";

const hour = 60 * 60 * 1000;
const now = new Date("2026-11-16T12:00:00.000Z");

const doc = (id: string, updatedAt: string) => ({
  id,
  title: `Doc ${id}`,
  slugId: id,
  url: `https://linear.app/acme/document/${id}`,
  updatedAt,
  content: `${id} body`,
});

test("a fresh state skips the network entirely", async () => {
  const linear = fakeLinear([doc("a", "t1")]);
  const store = memoryStore({ checkedAt: "2026-11-16T11:30:00.000Z", documents: { a: "t0" } });

  const result = await syncMirror({ ...linear.options, store, now, maxAgeMs: hour, force: false });

  expect(result).toEqual({ kind: "fresh" });
  expect(linear.requestedFields).toEqual([]);
  expect(store.writes).toEqual([]);
});

test("a stale state with unchanged documents only fetches metadata and bumps checkedAt", async () => {
  const linear = fakeLinear([doc("a", "t1"), doc("b", "t2")]);
  const store = memoryStore({
    checkedAt: "2026-11-16T10:00:00.000Z",
    documents: { a: "t1", b: "t2" },
  });

  const result = await syncMirror({ ...linear.options, store, now, maxAgeMs: hour, force: false });

  expect(result).toEqual({ kind: "unchanged" });
  expect(linear.requestedFields).toEqual(["id updatedAt"]);
  expect(store.writes).toEqual([
    { files: null, state: { checkedAt: now.toISOString(), documents: { a: "t1", b: "t2" } } },
  ]);
});

test("a changed document refetches content and rebuilds the mirror with the new state", async () => {
  const linear = fakeLinear([doc("a", "t1"), doc("b", "t3")]);
  const store = memoryStore({
    checkedAt: "2026-11-16T10:00:00.000Z",
    documents: { a: "t1", b: "t2" },
  });

  const result = await syncMirror({ ...linear.options, store, now, maxAgeMs: hour, force: false });

  expect(result).toEqual({ kind: "refreshed", documentCount: 2 });
  expect(linear.requestedFields).toEqual(["id updatedAt", "id title slugId url updatedAt content"]);
  expect(store.writes).toEqual([
    {
      files: ["README.md", "doc-a.md", "doc-b.md"],
      state: { checkedAt: now.toISOString(), documents: { a: "t1", b: "t3" } },
    },
  ]);
});

test("a missing state rebuilds the mirror without asking for metadata first", async () => {
  const linear = fakeLinear([doc("a", "t1")]);
  const store = memoryStore(null);

  const result = await syncMirror({ ...linear.options, store, now, maxAgeMs: hour, force: false });

  expect(result).toEqual({ kind: "refreshed", documentCount: 1 });
  expect(linear.requestedFields).toEqual(["id title slugId url updatedAt content"]);
});

test("force rebuilds even when the state is fresh", async () => {
  const linear = fakeLinear([doc("a", "t1")]);
  const store = memoryStore({ checkedAt: now.toISOString(), documents: { a: "t1" } });

  const result = await syncMirror({ ...linear.options, store, now, maxAgeMs: hour, force: true });

  expect(result).toEqual({ kind: "refreshed", documentCount: 1 });
  expect(linear.requestedFields).toEqual(["id title slugId url updatedAt content"]);
});

function fakeLinear(docs: ReturnType<typeof doc>[]) {
  const requestedFields: string[] = [];
  const fetch = async (_url: string, init: RequestInit) => {
    const { query } = JSON.parse(String(init.body));
    const fields = /nodes \{ ([^}]*) \}/.exec(String(query))?.[1]?.trim() ?? "";
    requestedFields.push(fields);
    const nodes = docs.map((d) =>
      fields.includes("content") ? d : { id: d.id, updatedAt: d.updatedAt },
    );
    return Response.json({
      data: {
        project: { documents: { nodes, pageInfo: { hasNextPage: false, endCursor: null } } },
      },
    });
  };
  return { requestedFields, options: { fetch, apiKey: "lin_api_test", projectId: "project-uuid" } };
}

function memoryStore(initial: MirrorState | null) {
  const writes: { files: string[] | null; state: MirrorState }[] = [];
  let state = initial;
  const store: MirrorStore & { writes: typeof writes } = {
    writes,
    readState: async () => state,
    writeState: async (next) => {
      state = next;
      writes.push({ files: null, state: next });
    },
    replaceMirror: async (files, next) => {
      state = next;
      writes.push({ files: [...files.keys()], state: next });
    },
  };
  return store;
}
