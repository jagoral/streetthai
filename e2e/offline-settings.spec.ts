import { expect, test } from "./network-guard.ts";

test("a polite particle chosen offline is still selected after an offline reload", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.evaluate(() => window.location.assign("/settings"));
  await expect(page.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
  const ka = page.getByRole("radio", { name: "ka" });
  await expect(ka).not.toBeChecked();

  await ka.check();
  await expect(ka).toBeChecked();
  await expect(page.getByRole("group", { name: "Polite particle" })).toHaveAttribute(
    "aria-busy",
    "false",
  );

  await page.reload();

  await expect(page.getByRole("radio", { name: "ka" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "krap" })).not.toBeChecked();
  expect(await page.evaluate(() => navigator.onLine)).toBe(false);
});
