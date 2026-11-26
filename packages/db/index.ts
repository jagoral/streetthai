import type { Collection, UtilsRecord } from "@tanstack/db";
import type { RxStorage } from "rxdb";
import { z } from "zod";

/** Primary key of the single Learner-settings document. */
export const LEARNER_SETTINGS_ID = "default" as const;

/** Allowed polite particle preferences a Learner selects during onboarding. */
export const politeParticles = ["krap", "ka"] as const;

/** Canonical polite particle preference (`"krap"` for male, `"ka"` for female). */
export type PoliteParticle = (typeof politeParticles)[number];

/** Zod schema for the single-document Learner-settings record. */
export const learnerSettingsSchema = z.object({
  id: z.literal(LEARNER_SETTINGS_ID),
  politeParticle: z.enum(politeParticles),
});

/** Validated Learner-settings document inferred from {@link learnerSettingsSchema}. */
export type LearnerSettings = z.infer<typeof learnerSettingsSchema>;

/** TanStack DB collection exposing the single Learner-settings document. */
export type LearnerSettingsCollection = Collection<
  LearnerSettings,
  string,
  UtilsRecord,
  typeof learnerSettingsSchema,
  LearnerSettings
>;

/** Options for opening a local-first StreetThai database instance. */
export interface CreateDbOptions<TInternals, TInstanceCreationOptions> {
  /** RxDB storage adapter supplied by the caller (for example `getRxStorageDexie()`). */
  readonly storage: RxStorage<TInternals, TInstanceCreationOptions>;
  /** Database name isolating persisted data (defaults to `"streetthai"`). */
  readonly name?: string;
}

/** Handle to an open local-first StreetThai database and its TanStack DB collections. */
export interface StreetThaiDb {
  /** TanStack DB collection for the single Learner-settings document. */
  readonly learnerSettings: LearnerSettingsCollection;
  /** Cleans up collection subscriptions and closes the underlying RxDB database. */
  close(): Promise<void>;
}

/** Error thrown when a database capability has not been implemented yet. */
export class DbNotImplementedError extends Error {
  readonly code = "DB_NOT_IMPLEMENTED" as const;

  constructor(capability: string) {
    super(`@streetthai/db: ${capability} is not implemented yet.`);
    this.name = "DbNotImplementedError";
  }
}

/** Opens a local-first StreetThai database on the caller-provided RxDB storage. */
export async function createDb<TInternals, TInstanceCreationOptions>(
  options: CreateDbOptions<TInternals, TInstanceCreationOptions>,
): Promise<StreetThaiDb> {
  void options;
  throw new DbNotImplementedError("createDb");
}
