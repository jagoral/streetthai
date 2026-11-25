import { parseDocumentsResponse, type ProductDoc } from "./linear-documents.parse.ts";

export type Fetch = (url: string, init: RequestInit) => Promise<Response>;

export type FetchProjectDocumentsOptions = {
  fetch: Fetch;
  apiKey: string;
  projectId: string;
};

export const linearGraphqlUrl = "https://api.linear.app/graphql";

export async function fetchProjectDocuments(
  options: FetchProjectDocumentsOptions,
): Promise<ProductDoc[]> {
  const docs: ProductDoc[] = [];
  let after: string | null = null;
  for (;;) {
    const response = await options.fetch(linearGraphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: options.apiKey },
      body: JSON.stringify({ query, variables: { projectId: options.projectId, after } }),
    });
    const result = parseDocumentsResponse(await response.text());
    if (!result.ok) {
      throw new Error(`Linear API error (HTTP ${response.status}): ${result.messages.join("; ")}`);
    }
    docs.push(...result.page.nodes);
    if (!result.page.pageInfo.hasNextPage || result.page.pageInfo.endCursor === null) {
      return docs;
    }
    after = result.page.pageInfo.endCursor;
  }
}

const query = `
  query ProjectDocuments($projectId: String!, $after: String) {
    project(id: $projectId) {
      documents(first: 50, after: $after) {
        nodes { title slugId url updatedAt content }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
