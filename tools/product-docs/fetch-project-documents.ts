import {
  parseDocumentMetadataResponse,
  parseDocumentsResponse,
  type DocumentMeta,
  type DocumentsPageResult,
  type ProductDoc,
} from "./linear-documents.parse.ts";

export type Fetch = (url: string, init: RequestInit) => Promise<Response>;

export type FetchProjectDocumentsOptions = {
  fetch: Fetch;
  apiKey: string;
  projectId: string;
};

export const linearGraphqlUrl = "https://api.linear.app/graphql";

export function fetchProjectDocuments(
  options: FetchProjectDocumentsOptions,
): Promise<ProductDoc[]> {
  return fetchAllPages(
    options,
    documentsQuery("id title slugId url updatedAt content"),
    parseDocumentsResponse,
  );
}

export function fetchProjectDocumentMetadata(
  options: FetchProjectDocumentsOptions,
): Promise<DocumentMeta[]> {
  return fetchAllPages(options, documentsQuery("id updatedAt"), parseDocumentMetadataResponse);
}

async function fetchAllPages<Node>(
  options: FetchProjectDocumentsOptions,
  query: string,
  parse: (text: string) => DocumentsPageResult<Node>,
): Promise<Node[]> {
  const nodes: Node[] = [];
  let after: string | null = null;
  for (;;) {
    const response = await options.fetch(linearGraphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: options.apiKey },
      body: JSON.stringify({ query, variables: { projectId: options.projectId, after } }),
    });
    const result = parse(await response.text());
    if (!result.ok) {
      throw new Error(`Linear API error (HTTP ${response.status}): ${result.messages.join("; ")}`);
    }
    nodes.push(...result.page.nodes);
    if (!result.page.pageInfo.hasNextPage || result.page.pageInfo.endCursor === null) {
      return nodes;
    }
    after = result.page.pageInfo.endCursor;
  }
}

function documentsQuery(fields: string): string {
  return `
  query ProjectDocuments($projectId: String!, $after: String) {
    project(id: $projectId) {
      documents(first: 50, after: $after) {
        nodes { ${fields} }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
}
