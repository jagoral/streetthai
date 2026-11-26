import type { APIRequestContext } from "@playwright/test";
import { z } from "zod";
import { expect, test } from "./network-guard.ts";

test("the index route renders the installable app shell after hydration", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("heading", { level: 1, name: "StreetThai" })).toBeVisible();
  await expect(page.getByText("Speak Thai at the street stall, even offline.")).toBeVisible();

  const appleTouchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  await expectSquarePng(page.request, appleTouchIcon, 180);

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
  const manifestResponse = await page.request.get(manifestHref ?? "");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = webManifest.parse(await manifestResponse.json());
  expect(manifest).toMatchObject({ start_url: "/", display: "standalone" });
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ sizes: "192x192", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "any" }),
      expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
    ]),
  );
  for (const icon of manifest.icons) {
    await expectSquarePng(page.request, icon.src, Number(icon.sizes.split("x")[0]));
  }
});

const webManifest = z.object({
  name: z.literal("StreetThai"),
  short_name: z.string().min(1),
  start_url: z.string(),
  display: z.string(),
  icons: z.array(
    z.object({
      src: z.string(),
      sizes: z.string().regex(/^\d+x\d+$/),
      type: z.literal("image/png"),
      purpose: z.string(),
    }),
  ),
});

async function expectSquarePng(request: APIRequestContext, href: string | null, size: number) {
  const response = await request.get(href ?? "");
  expect(response.ok(), `${href} responds`).toBe(true);
  expect(response.headers()["content-type"]).toBe("image/png");
  const png = await response.body();
  expect([png.readUInt32BE(16), png.readUInt32BE(20)], `${href} dimensions`).toEqual([size, size]);
}
