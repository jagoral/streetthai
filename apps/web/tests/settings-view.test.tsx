import { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { SettingsView } from "../src/components/settings-view.tsx";
import { createDbConnection, type DbConnection } from "../src/db/use-street-thai-db.ts";

const TEST_DB_NAME = "streetthai-settings-view-test";

const unmounts: Array<() => Promise<void>> = [];

beforeEach(async () => {
  await clearTestDatabases(TEST_DB_NAME);
});

afterEach(async () => {
  await unmountAll();
  await clearTestDatabases(TEST_DB_NAME);
});

test("a polite particle saved elsewhere updates the settings view without a reload", async () => {
  const connection = mountOnTestDb();
  const krap = page.getByRole("radio", { name: "krap" });
  const ka = page.getByRole("radio", { name: "ka" });

  await expect.element(krap).not.toBeChecked();
  await expect.element(ka).not.toBeChecked();

  const { db } = await connection.open();
  await db.savePoliteParticle("krap");

  await expect.element(krap).toBeChecked();
  await expect.element(ka).not.toBeChecked();
});

test("a chosen polite particle is still selected after the database is closed and reopened", async () => {
  mountOnTestDb();
  const ka = page.getByRole("radio", { name: "ka" });

  await ka.click();
  await expect.element(ka).toBeChecked();
  await expect
    .element(page.getByRole("group", { name: "Polite particle" }))
    .toHaveAttribute("aria-busy", "false");
  await unmountAll();

  mountOnTestDb();

  await expect.element(page.getByRole("radio", { name: "ka" })).toBeChecked();
  await expect.element(page.getByRole("radio", { name: "krap" })).not.toBeChecked();
});

test("a database that fails to open reaches the nearest error boundary", async () => {
  const connection = createDbConnection({
    loadStorage: () => Promise.reject(new Error("storage unavailable")),
    name: TEST_DB_NAME,
  });

  mount(
    <TestErrorBoundary>
      <SettingsView connection={connection} />
    </TestErrorBoundary>,
    async () => undefined,
  );

  await expect.element(page.getByRole("alert")).toHaveTextContent("storage unavailable");
});

class TestErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    return this.state.error === null ? (
      this.props.children
    ) : (
      <p role="alert">{this.state.error.message}</p>
    );
  }
}

function mountOnTestDb(): DbConnection {
  const connection = createDbConnection({
    loadStorage: async () => getRxStorageDexie(),
    name: TEST_DB_NAME,
  });
  mount(<SettingsView connection={connection} />, async () => {
    const { db } = await connection.open();
    await db.close();
  });
  return connection;
}

function mount(element: ReactNode, release: () => Promise<void>): void {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  root.render(element);
  unmounts.push(async () => {
    root.unmount();
    container.remove();
    await release();
  });
}

async function unmountAll(): Promise<void> {
  for (const unmount of unmounts.splice(0)) {
    await unmount();
  }
}

async function clearTestDatabases(nameFragment: string): Promise<void> {
  const databases = await indexedDB.databases();
  const matching = databases
    .map((entry) => entry.name)
    .filter((name): name is string => typeof name === "string" && name.includes(nameFragment));

  await Promise.all(
    matching.map(
      (name) =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase(name);
          request.addEventListener("success", () => resolve(), { once: true });
          request.addEventListener(
            "error",
            () => reject(request.error ?? new Error(`Failed to delete ${name}`)),
            { once: true },
          );
          request.addEventListener(
            "blocked",
            () =>
              reject(
                new Error(
                  `Deletion of IndexedDB database "${name}" was blocked by an open connection`,
                ),
              ),
            { once: true },
          );
        }),
    ),
  );
}
