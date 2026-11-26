import type { CreateDbOptions, StreetThaiDb } from "@streetthai/db";
import { useEffect, useState } from "react";

/** RxDB storage adapter the composition root hands to the client-only database. */
export type DbStorage = CreateDbOptions<unknown, unknown>["storage"];

/** Options for a lazily opened, client-only StreetThai database. */
export interface DbConnectionOptions {
  /** Loads the RxDB storage adapter; called once, on the client, when the database first opens. */
  readonly loadStorage: () => Promise<DbStorage>;
  /** Database name isolating persisted data (defaults to the `@streetthai/db` default). */
  readonly name?: string;
}

/** The dynamically imported `@streetthai/db` entry, for its runtime constants. */
export type StreetThaiDbModule = typeof import("@streetthai/db");

/** An open StreetThai database together with the `@streetthai/db` entry that opened it. */
export interface OpenStreetThaiDb {
  /** The open database and its TanStack DB collections. */
  readonly db: StreetThaiDb;
  /** The `@streetthai/db` entry, loaded on the client only. */
  readonly module: StreetThaiDbModule;
}

/** Shared handle that opens the StreetThai database at most once per connection. */
export interface DbConnection {
  /** Opens the database on first call and returns the same instance afterwards. */
  open(): Promise<OpenStreetThaiDb>;
}

/** Loading state of the StreetThai database as seen by a component. */
export type StreetThaiDbState =
  | { readonly status: "loading" }
  | ({ readonly status: "ready" } & OpenStreetThaiDb)
  | { readonly status: "error"; readonly error: unknown };

/** Creates a connection whose database (and `@streetthai/db` code) loads only when first opened. */
export function createDbConnection(options: DbConnectionOptions): DbConnection {
  let opening: Promise<OpenStreetThaiDb> | undefined;
  return {
    open() {
      opening ??= openStreetThaiDb(options);
      return opening;
    },
  };
}

/** Client hook that opens the connection's database after mount and tracks its loading state. */
export function useStreetThaiDb(connection: DbConnection): StreetThaiDbState {
  const [state, setState] = useState<StreetThaiDbState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    connection.open().then(
      (opened) => {
        if (active) setState({ status: "ready", ...opened });
      },
      (error: unknown) => {
        if (active) setState({ status: "error", error });
      },
    );
    return () => {
      active = false;
    };
  }, [connection]);

  return state;
}

async function openStreetThaiDb(options: DbConnectionOptions): Promise<OpenStreetThaiDb> {
  if (import.meta.env.SSR) {
    throw new ClientOnlyDbError();
  }
  const [module, storage] = await Promise.all([import("@streetthai/db"), options.loadStorage()]);
  const db = await module.createDb({
    storage,
    ...(options.name === undefined ? {} : { name: options.name }),
  });
  await db.learnerSettings.preload();
  return { db, module };
}

class ClientOnlyDbError extends Error {
  constructor() {
    super("The StreetThai database opens only in the browser");
    this.name = "ClientOnlyDbError";
  }
}
