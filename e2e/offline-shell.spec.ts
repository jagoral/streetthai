import { expect, test } from "./network-guard.ts";

test("after one load the service worker controls the page and serves the shell offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");

  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("heading", { level: 1, name: "StreetThai" })).toBeVisible();
  await expect(page.getByText("Speak Thai at the street stall, even offline.")).toBeVisible();
  expect(await page.evaluate(() => navigator.serviceWorker.controller?.state)).toBe("activated");
});
