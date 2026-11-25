import { expect, test } from "vitest";
import { fetchProjectDocuments } from "../fetch-project-documents.ts";

const doc = (title: string) => ({
  title,
  slugId: title.toLowerCase(),
  url: `https://linear.app/acme/document/${title.toLowerCase()}`,
  updatedAt: "2026-11-10T09:00:00.000Z",
  content: `${title} body`,
});

test("follows the documents cursor until the last page, sending the API key and project id", async () => {
  const requests: { url: string; authorization: string | null; body: string }[] = [];
  const pages = [
    { nodes: [doc("One")], pageInfo: { hasNextPage: true, endCursor: "c1" } },
    { nodes: [doc("Two")], pageInfo: { hasNextPage: false, endCursor: "c2" } },
  ];
  const fakeFetch = async (url: string, init: RequestInit) => {
    requests.push({
      url,
      authorization: new Headers(init.headers).get("authorization"),
      body: String(init.body),
    });
    const documents = pages[requests.length - 1];
    return Response.json({ data: { project: { documents } } });
  };

  const docs = await fetchProjectDocuments({
    fetch: fakeFetch,
    apiKey: "lin_api_test",
    projectId: "project-uuid",
  });

  expect(docs.map((d) => d.title)).toEqual(["One", "Two"]);
  expect(requests.map((r) => r.url)).toEqual([
    "https://api.linear.app/graphql",
    "https://api.linear.app/graphql",
  ]);
  expect(requests.every((r) => r.authorization === "lin_api_test")).toBe(true);
  expect(requests.map((r) => JSON.parse(r.body).variables)).toEqual([
    { projectId: "project-uuid", after: null },
    { projectId: "project-uuid", after: "c1" },
  ]);
});

test("a rejected API key surfaces Linear's error message", async () => {
  await expect(
    fetchProjectDocuments({
      fetch: async () =>
        Response.json({ errors: [{ message: "Authentication required" }] }, { status: 401 }),
      apiKey: "bad",
      projectId: "project-uuid",
    }),
  ).rejects.toThrow("Linear API error (HTTP 401): Authentication required");
});
