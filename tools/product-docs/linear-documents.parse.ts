import { z } from "zod";

export type ProductDoc = z.infer<typeof productDocSchema>;

export type DocumentsPage = z.infer<typeof documentsPageSchema>;

export type DocumentsPageResult =
  | { ok: true; page: DocumentsPage }
  | { ok: false; messages: readonly string[] };

export function parseDocumentsResponse(text: string): DocumentsPageResult {
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, messages: [text.slice(0, 200) || "empty response body"] };
  }
  const response = responseSchema.safeParse(body);
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

const productDocSchema = z.object({
  title: z.string(),
  slugId: z.string(),
  url: z.string(),
  updatedAt: z.string(),
  content: z
    .string()
    .nullish()
    .transform((content) => content ?? ""),
});

const documentsPageSchema = z.object({
  nodes: z.array(productDocSchema),
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    endCursor: z.string().nullable(),
  }),
});

const responseSchema = z.object({
  data: z
    .object({
      project: z.object({ documents: documentsPageSchema }).nullable(),
    })
    .nullish(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});
