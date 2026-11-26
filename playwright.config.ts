import { defineConfig, devices } from "@playwright/test";

const port = 4310;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "e2e",
  testMatch: "*.spec.ts",
  retries: 0,
  forbidOnly: true,
  globalTimeout: 60_000,
  use: {
    baseURL,
    timezoneId: "UTC",
    locale: "en-US",
    reducedMotion: "reduce",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm turbo run build --filter=@streetthai/web && node apps/web/.output/server/index.mjs`,
    env: { PORT: String(port), NODE_ENV: "production" },
    url: baseURL,
    reuseExistingServer: false,
  },
});
