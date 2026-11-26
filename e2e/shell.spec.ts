import { expect, test } from "./network-guard.ts";

test("the index route renders the app shell after hydration", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("heading", { level: 1, name: "StreetThai" })).toBeVisible();
  await expect(page.getByText("Speak Thai at the street stall, even offline.")).toBeVisible();
});
