import { expect, guardNetwork, test } from "./network-guard.ts";

test("a request to a non-localhost origin is aborted and fails the guard", async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const guard = await guardNetwork(context);
    const page = await context.newPage();

    const outcome = await page.evaluate(() =>
      fetch("https://example.com/").then(
        () => "reached",
        () => "aborted",
      ),
    );

    expect(outcome).toBe("aborted");
    expect(guard.blockedOrigins()).toEqual(["https://example.com"]);
    expect(() => guard.assertNoBlockedRequests()).toThrow(
      "Blocked request to non-localhost origin https://example.com",
    );
  } finally {
    await context.close();
  }
});

test("a request to localhost passes the guard", async ({ page, networkGuard }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  expect(networkGuard.blockedOrigins()).toEqual([]);
});
