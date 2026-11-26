import { LEARNER_SETTINGS_ID } from "@streetthai/db";
import { createRoot, type Root } from "react-dom/client";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { SettingsView } from "../src/components/settings-view.tsx";
import { createDbConnection, type DbConnection } from "../src/db/use-street-thai-db.ts";

const TEST_DB_NAME = "streetthai-settings-view-test";

const mounted: Array<{ root: Root; container: HTMLElement; connection: DbConnection }> = [];

beforeEach(async () => {
  await clearTestDatabases(TEST_DB_NAME);
});

afterEach(async () => {
  await unmountAll();
  await clearTestDatabases(TEST_DB_NAME);
});

test("a polite-particle change updates the settings view without a reload", async () => {
  const connection = mount();
  const { db } = await connection.open();
  const krap = page.getByRole("radio", { name: "krap" });
  const ka = page.getByRole("radio", { name: "ka" });

  await expect.element(krap).not.toBeChecked();
  await expect.element(ka).not.toBeChecked();

  await db.learnerSettings
    .insert({ id: LEARNER_SETTINGS_ID, politeParticle: "krap" })
    .when("settled");
  await expect.element(krap).toBeChecked();

  await ka.click();
  await expect.element(ka).toBeChecked();
  await expect.element(krap).not.toBeChecked();
  await expect.element(page.getByRole("group", { name: "Polite particle" })).toBeEnabled();
  expect(db.learnerSettings.get(LEARNER_SETTINGS_ID)?.politeParticle).toBe("ka");
});

test("a stored polite particle renders after the database is closed and reopened", async () => {
  const first = mount();
  const { db } = await first.open();
  await db.learnerSettings
    .insert({ id: LEARNER_SETTINGS_ID, politeParticle: "ka" })
    .when("settled");
  await unmountAll();

  mount();

  await expect.element(page.getByRole("radio", { name: "ka" })).toBeChecked();
  await expect.element(page.getByRole("radio", { name: "krap" })).not.toBeChecked();
});

function mount(): DbConnection {
  const connection = createDbConnection({
    loadStorage: async () => getRxStorageDexie(),
    name: TEST_DB_NAME,
  });
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  root.render(<SettingsView connection={connection} />);
  mounted.push({ root, container, connection });
  return connection;
}

async function unmountAll(): Promise<void> {
  for (const { root, container, connection } of mounted.splice(0)) {
    root.unmount();
    container.remove();
    const { db } = await connection.open();
    await db.close();
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
