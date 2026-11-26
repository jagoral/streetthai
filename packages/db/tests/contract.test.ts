import type { RxStorage } from "rxdb";
import { describe, expect, test } from "vitest";
import {
  createDb,
  DbNotImplementedError,
  LEARNER_SETTINGS_ID,
  learnerSettingsSchema,
  politeParticles,
  type CreateDbOptions,
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
  test("accepts an RxDB storage parameter and rejects with DbNotImplementedError on the stub", async () => {
    const fakeStorage: RxStorage<unknown, unknown> = {
      name: "fake-storage",
      rxdbVersion: "17.6.0",
      createStorageInstance() {
        return Promise.reject(new Error("storage should not be invoked by stub"));
      },
    };
    const options: CreateDbOptions<unknown, unknown> = {
      storage: fakeStorage,
      name: "streetthai-contract-test",
    };

    await expect(createDb(options)).rejects.toThrow(DbNotImplementedError);
  });

  test("exposes only the root entry point in package exports", () => {
    expect(manifest.exports).toEqual({ ".": "./index.ts" });
  });
});
