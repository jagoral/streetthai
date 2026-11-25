import { z } from "zod";

export type ProductDoc = z.infer<typeof productDocSchema>;

export type DocumentMeta = z.infer<typeof documentMetaSchema>;

export type DocumentsPage<Node> = {
  nodes: Node[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

export type DocumentsPageResult<Node> =
  | { ok: true; page: DocumentsPage<Node> }
  | { ok: false; messages: readonly string[] };

export function parseDocumentsResponse(text: string): DocumentsPageResult<ProductDoc> {
  return parsePage(text, productDocSchema);
}

export function parseDocumentMetadataResponse(text: string): DocumentsPageResult<DocumentMeta> {
  return parsePage(text, documentMetaSchema);
}

function parsePage<Node>(text: string, nodeSchema: z.ZodType<Node>): DocumentsPageResult<Node> {
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, messages: [text.slice(0, 200) || "empty response body"] };
  }
  const response = responseSchema(nodeSchema).safeParse(body);
  if (!response.success) {
    return { ok: false, messages: [`unexpected response shape (${response.error.message})`] };
  }
  const { data, errors } = response.data;
  if (errors !== undefined && errors.length > 0) {
    return { ok: false, messages: errors.map((error) => error.message) };
  }
  if (data === undefined || data === null) {
    return { ok: false, messages: ["response has no data"] };
  }
  if (data.project === null) {
    return { ok: false, messages: ["project not found or not visible to this API key"] };
  }
  return { ok: true, page: data.project.documents };
}

const documentMetaSchema = z.object({
  id: z.string(),
  updatedAt: z.string(),
});

const productDocSchema = documentMetaSchema.extend({
  title: z.string(),
  slugId: z.string(),
  url: z.string(),
  content: z
    .string()
    .nullish()
    .transform((content) => content ?? ""),
});

function responseSchema<Node>(nodeSchema: z.ZodType<Node>) {
  return z.object({
    data: z
      .object({
        project: z
          .object({
            documents: z.object({
              nodes: z.array(nodeSchema),
              pageInfo: z.object({
                hasNextPage: z.boolean(),
                endCursor: z.string().nullable(),
              }),
            }),
          })
          .nullable(),
      })
      .nullish(),
    errors: z.array(z.object({ message: z.string() })).optional(),
  });
}
