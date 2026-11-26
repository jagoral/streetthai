import { createCollection, type Collection, type UtilsRecord } from "@tanstack/db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { createRxDatabase, type RxCollection, type RxStorage } from "rxdb";
import {
  LEARNER_SETTINGS_ID,
  learnerSettingsRxSchema,
  learnerSettingsSchema,
  type LearnerSettings,
  type PoliteParticle,
} from "./learner-settings.ts";

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
  /** The Learner's saved polite particle, or `undefined` before the first save. */
  politeParticle(): PoliteParticle | undefined;
  /**
   * Saves the Learner's polite particle, creating the Learner-settings document on first save;
   * storage serializes concurrent saves so the last one wins, and once preloaded,
   * `learnerSettings` reflects the save when the returned promise resolves.
   */
  savePoliteParticle(politeParticle: PoliteParticle): Promise<void>;
  /** Cleans up collection subscriptions and closes the underlying RxDB database. */
  close(): Promise<void>;
}

/** Opens a local-first StreetThai database on the caller-provided RxDB storage. */
export async function createDb<TInternals, TInstanceCreationOptions>(
  options: CreateDbOptions<TInternals, TInstanceCreationOptions>,
): Promise<StreetThaiDb> {
  const name = options.name ?? DEFAULT_DB_NAME;
  const rxDatabase = await createRxDatabase<StreetThaiRxCollections>({
    name,
    storage: options.storage,
  });

  const collections = await rxDatabase.addCollections({
    learner_settings: {
      schema: learnerSettingsRxSchema,
    },
  });

  const learnerSettings = createCollection(
    rxdbCollectionOptions({
      id: `${name}:learner_settings`,
      rxCollection: collections.learner_settings,
      schema: learnerSettingsSchema,
    }),
  );

  return {
    learnerSettings,
    politeParticle() {
      return learnerSettings.get(LEARNER_SETTINGS_ID)?.politeParticle;
    },
    async savePoliteParticle(politeParticle) {
      await collections.learner_settings.incrementalUpsert({
        id: LEARNER_SETTINGS_ID,
        politeParticle,
      });
    },
    async close() {
      try {
        await learnerSettings.cleanup();
      } finally {
        await rxDatabase.close();
      }
    },
  };
}

const DEFAULT_DB_NAME = "streetthai";

interface StreetThaiRxCollections {
  learner_settings: RxCollection<LearnerSettings>;
}
