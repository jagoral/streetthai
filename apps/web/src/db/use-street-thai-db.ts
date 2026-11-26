import type { CreateDbOptions, PoliteParticle, StreetThaiDb } from "@streetthai/db";
import { use } from "react";

/** Options for a lazily opened, client-only StreetThai database. */
export interface DbConnectionOptions<TInternals, TInstanceCreationOptions> {
  /** Loads the RxDB storage adapter; called once, on the client, when the database first opens. */
  readonly loadStorage: () => Promise<
    CreateDbOptions<TInternals, TInstanceCreationOptions>["storage"]
  >;
  /** Database name isolating persisted data (defaults to the `@streetthai/db` default). */
  readonly name?: string;
}

/** An open StreetThai database together with the polite particles a Learner can choose from. */
export interface OpenStreetThaiDb {
  /** The open database and its TanStack DB collections. */
  readonly db: StreetThaiDb;
  /** Every polite particle a Learner can choose, in display order. */
  readonly politeParticles: readonly PoliteParticle[];
}

/** Shared handle that opens the StreetThai database at most once per connection. */
export interface DbConnection {
  /** Opens the database on first call and returns the same promise afterwards. */
  open(): Promise<OpenStreetThaiDb>;
}

/** Creates a connection whose database (and `@streetthai/db` code) loads only when first opened. */
export function createDbConnection<TInternals, TInstanceCreationOptions>(
  options: DbConnectionOptions<TInternals, TInstanceCreationOptions>,
): DbConnection {
  let opening: Promise<OpenStreetThaiDb> | undefined;
  return {
    open() {
      opening ??= openStreetThaiDb(options);
      return opening;
    },
  };
}

/**
 * Client hook that suspends until the connection's database is open; a failure to open reaches
 * the nearest error boundary.
 */
export function useStreetThaiDb(connection: DbConnection): OpenStreetThaiDb {
  return use(connection.open());
}

async function openStreetThaiDb<TInternals, TInstanceCreationOptions>(
  options: DbConnectionOptions<TInternals, TInstanceCreationOptions>,
): Promise<OpenStreetThaiDb> {
  if (import.meta.env.SSR) {
    throw new ClientOnlyDbError();
  }
  const [module, storage] = await Promise.all([import("@streetthai/db"), options.loadStorage()]);
  const db = await module.createDb({
    storage,
    ...(options.name === undefined ? {} : { name: options.name }),
  });
  await db.learnerSettings.preload();
  return { db, politeParticles: module.politeParticles };
}

class ClientOnlyDbError extends Error {
  constructor() {
    super("The StreetThai database opens only in the browser");
    this.name = "ClientOnlyDbError";
  }
}
