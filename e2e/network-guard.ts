import { test as base, expect, type BrowserContext } from "@playwright/test";

export { expect };

export type NetworkGuard = {
  blockedOrigins: () => readonly string[];
  assertNoBlockedRequests: () => void;
};

/**
 * Playwright `test` whose every browser context aborts requests to non-localhost origins and
 * fails the test when any was attempted. Specs import `test` and `expect` from here.
 */
export const test = base.extend<{ networkGuard: NetworkGuard }>({
  networkGuard: [
    async ({ context }, use) => {
      const guard = await guardNetwork(context);
      await use(guard);
      guard.assertNoBlockedRequests();
    },
    { auto: true },
  ],
});

/**
 * Aborts every request from `context` to a non-localhost origin and records its origin.
 */
export async function guardNetwork(context: BrowserContext): Promise<NetworkGuard> {
  const blocked: string[] = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (isLocalOrigin(url)) {
      await route.fallback();
      return;
    }
    blocked.push(url.origin);
    await route.abort("blockedbyclient");
  });
  return {
    blockedOrigins: () => [...blocked],
    assertNoBlockedRequests: () => {
      if (blocked.length > 0) {
        throw new Error(`Blocked request to non-localhost origin ${blocked.join(", ")}`);
      }
    },
  };
}

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

function isLocalOrigin(url: URL): boolean {
  return !url.protocol.startsWith("http") || localHostnames.has(url.hostname);
}
