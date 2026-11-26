import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

const exclude = [
  ...configDefaults.exclude,
  ".agents/**",
  ".claude/**",
  "internal-docs/**",
  ".product-docs/**",
];

export default defineConfig({
  test: {
    retry: 0,
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["**/*.test.ts"],
          exclude: [...exclude, "**/*.browser.test.ts", "**/*.verify.test.ts"],
          setupFiles: ["tools/vitest/localhost-only-fetch.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.test.tsx", "**/*.browser.test.ts"],
          exclude,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              contextOptions: { timezoneId: "UTC", locale: "en-US", reducedMotion: "reduce" },
            }),
            instances: [{ browser: "chromium" }],
          },
        },
        optimizeDeps: {
          entries: ["**/*.test.tsx", "**/*.browser.test.ts"],
        },
        server: {
          headers: {
            "Content-Security-Policy":
              "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
          },
        },
      },
    ],
  },
});
