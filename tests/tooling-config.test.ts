import oxlintrc from "@streetthai/config/oxlintrc.json" with { type: "json" };
import { expect, test } from "vitest";
import config from "../vitest.config.ts";

test("Vitest never retries a failing test", () => {
  expect(config.test?.retry).toBe(0);
});

test("OXLint bans focused, skipped and todo tests and fixed Playwright timeouts", () => {
  expect(oxlintrc.plugins).toContain("vitest");
  expect(oxlintrc.rules).toMatchObject({
    "vitest/no-focused-tests": "error",
    "vitest/no-disabled-tests": "error",
    "vitest/warn-todo": "error",
    "eslint/no-restricted-properties": [
      "error",
      expect.objectContaining({ object: "page", property: "waitForTimeout" }),
    ],
  });
});

test("the node project runs *.test.ts except browser and verify tests, offline in plain Node", () => {
  expect(config.test?.projects?.[0]).toMatchObject({
    test: {
      name: "node",
      environment: "node",
      include: ["**/*.test.ts"],
      exclude: expect.arrayContaining(["**/*.browser.test.ts", "**/*.verify.test.ts"]),
      setupFiles: ["tools/vitest/localhost-only-fetch.ts"],
    },
  });
});

test("the browser project runs *.test.tsx and *.browser.test.ts offline in headless Playwright Chromium", () => {
  expect(config.test?.projects?.[1]).toMatchObject({
    test: {
      name: "browser",
      include: ["**/*.test.tsx", "**/*.browser.test.ts"],
      browser: {
        enabled: true,
        headless: true,
        provider: {
          name: "playwright",
          options: {
            contextOptions: { timezoneId: "UTC", locale: "en-US", reducedMotion: "reduce" },
          },
        },
        instances: [{ browser: "chromium" }],
      },
    },
    server: {
      headers: {
        "Content-Security-Policy": "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
      },
    },
  });
});

test("no project emulates the DOM with jsdom or happy-dom", () => {
  expect(config.test?.projects).toHaveLength(2);
  expect(JSON.stringify(config)).not.toMatch(/jsdom|happy-dom/);
});
