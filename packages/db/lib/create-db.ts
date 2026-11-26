import { createCollection, type Collection, type UtilsRecord } from "@tanstack/db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { createRxDatabase, type RxCollection, type RxStorage } from "rxdb";
import {
  learnerSettingsRxSchema,
  learnerSettingsSchema,
  type LearnerSettings,
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
    async close() {
      await learnerSettings.cleanup();
      await rxDatabase.close();
    },
  };
}

const DEFAULT_DB_NAME = "streetthai";

interface StreetThaiRxCollections {
  learner_settings: RxCollection<LearnerSettings>;
}
