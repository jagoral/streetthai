import type { RxJsonSchema } from "rxdb";
import { z } from "zod";

/** Primary key of the single Learner-settings document. */
export const LEARNER_SETTINGS_ID = "default" as const;

/** Allowed polite particle preferences a Learner selects during onboarding. */
export const politeParticles = ["krap", "ka"] as const;

/** Canonical Thai polite particle preference selected by the Learner (`"krap"` or `"ka"`). */
export type PoliteParticle = (typeof politeParticles)[number];

/** Zod schema for the single-document Learner-settings record. */
export const learnerSettingsSchema = z.object({
  id: z.literal(LEARNER_SETTINGS_ID),
  politeParticle: z.enum(politeParticles),
});

/** Validated Learner-settings document inferred from {@link learnerSettingsSchema}. */
export type LearnerSettings = z.infer<typeof learnerSettingsSchema>;

export const learnerSettingsRxSchema: RxJsonSchema<LearnerSettings> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 64,
    },
    politeParticle: {
      type: "string",
      enum: [...politeParticles],
    },
  },
  required: ["id", "politeParticle"],
  additionalProperties: false,
};
