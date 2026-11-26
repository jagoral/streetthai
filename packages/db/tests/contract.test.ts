import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { describe, expect, test } from "vitest";
import {
  createDb,
  LEARNER_SETTINGS_ID,
  learnerSettingsSchema,
  politeParticles,
  type LearnerSettings,
} from "../index.ts";
import manifest from "../package.json" with { type: "json" };

describe("learnerSettingsSchema", () => {
  test("parses valid single-document Learner settings for every canonical polite particle", () => {
    expect(politeParticles).toEqual(["krap", "ka"]);

    for (const politeParticle of politeParticles) {
      const parsed: LearnerSettings = learnerSettingsSchema.parse({
        id: LEARNER_SETTINGS_ID,
        politeParticle,
      });
      expect(parsed).toEqual({
        id: "default",
        politeParticle,
      });
    }
  });

  test("rejects non-singleton document IDs and unknown polite particles", () => {
    expect(
      learnerSettingsSchema.safeParse({
        id: "other-id",
        politeParticle: "krap",
      }).success,
    ).toBe(false);

    expect(
      learnerSettingsSchema.safeParse({
        id: LEARNER_SETTINGS_ID,
        politeParticle: "unknown",
      }).success,
    ).toBe(false);

    expect(
      learnerSettingsSchema.safeParse({
        id: LEARNER_SETTINGS_ID,
      }).success,
    ).toBe(false);
  });
});

describe("createDb contract", () => {
  test("builds an RxDB-backed TanStack DB collection on the caller-provided storage", async () => {
    const db = await createDb({
      storage: getRxStorageMemory(),
      name: "streetthai-contract-test",
    });

    try {
      await db.learnerSettings.preload();
      const writeTx = db.learnerSettings.insert({
        id: LEARNER_SETTINGS_ID,
        politeParticle: "krap",
      });
      await writeTx.when("settled");

      expect(learnerSettingsSchema.parse(db.learnerSettings.get(LEARNER_SETTINGS_ID))).toEqual({
        id: LEARNER_SETTINGS_ID,
        politeParticle: "krap",
      });
    } finally {
      await db.close();
    }
  });

  test("exposes only the root entry point in package exports", () => {
    expect(manifest.exports).toEqual({ ".": "./index.ts" });
  });
});
