import { z } from "zod";

export type MirrorState = z.infer<typeof mirrorStateSchema>;

export function parseMirrorState(text: string): MirrorState | null {
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  const state = mirrorStateSchema.safeParse(body);
  return state.success ? state.data : null;
}

const mirrorStateSchema = z.object({
  checkedAt: z.iso.datetime(),
  documents: z.record(z.string(), z.string()),
});
