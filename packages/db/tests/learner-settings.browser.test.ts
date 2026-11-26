import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { afterEach, beforeEach, expect, test } from "vitest";
import { createDb, LEARNER_SETTINGS_ID, learnerSettingsSchema } from "../index.ts";

const TEST_DB_NAME = "streetthai-learner-settings-reopen-test";

beforeEach(async () => {
  await clearTestDatabases(TEST_DB_NAME);
});

afterEach(async () => {
  await clearTestDatabases(TEST_DB_NAME);
});

test("persists Learner settings across DB close and reopen", async () => {
  const db = await createDb({
    storage: getRxStorageDexie(),
    name: TEST_DB_NAME,
  });

  try {
    await db.learnerSettings.preload();
    const writeTx = db.learnerSettings.insert({
      id: LEARNER_SETTINGS_ID,
      politeParticle: "ka",
    });
    await writeTx.when("settled");
  } finally {
    await db.close();
  }

  const reopened = await createDb({
    storage: getRxStorageDexie(),
    name: TEST_DB_NAME,
  });

  try {
    await reopened.learnerSettings.preload();
    expect(learnerSettingsSchema.parse(reopened.learnerSettings.get(LEARNER_SETTINGS_ID))).toEqual({
      id: LEARNER_SETTINGS_ID,
      politeParticle: "ka",
    });
  } finally {
    await reopened.close();
  }
});

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
