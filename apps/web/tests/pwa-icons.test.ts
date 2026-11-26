import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { expect, test } from "vitest";
import { pwaIcons, renderPwaIcon } from "../scripts/pwa-icons.ts";

const publicDir = new URL("../public/", import.meta.url);

test("public ships Android, maskable and the 180px apple-touch-icon PNGs at their sizes", () => {
  const shipped = readdirSync(publicDir)
    .filter((file) => file.endsWith(".png"))
    .toSorted()
    .map((file) => {
      const png = readFileSync(new URL(file, publicDir));
      return [file, png.readUInt32BE(16), png.readUInt32BE(20)];
    });

  expect(shipped).toEqual([
    ["apple-touch-icon.png", 180, 180],
    ["maskable-512x512.png", 512, 512],
    ["pwa-192x192.png", 192, 192],
    ["pwa-512x512.png", 512, 512],
  ]);
});

test("every committed PWA icon matches the deterministic render of its size", () => {
  for (const icon of pwaIcons) {
    const committed = readFileSync(new URL(icon.file, publicDir));
    const rendered = decodePixels(renderPwaIcon(icon.size));
    assert.ok(
      decodePixels(committed).equals(rendered),
      `${icon.file} is stale; run pnpm pwa:icons`,
    );
  }
});

test("a rendered icon is a non-blank RGB PNG of the requested size", () => {
  const png = renderPwaIcon(48);

  expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(48);
  expect(png.readUInt32BE(20)).toBe(48);
  const pixels = decodePixels(png);
  const colors = new Set<string>();
  for (let offset = 0; offset < pixels.length; offset += 3) {
    colors.add(pixels.subarray(offset, offset + 3).toString("hex"));
  }
  expect(colors.size).toBeGreaterThan(1);
});

function decodePixels(png: Buffer): Buffer {
  const width = png.readUInt32BE(16);
  const dataStart = png.indexOf("IDAT") + 4;
  const raw = inflateSync(png.subarray(dataStart, dataStart + png.readUInt32BE(dataStart - 8)));
  const rowLength = 1 + width * 3;
  const rows: Buffer[] = [];
  for (let row = 0; row + rowLength <= raw.length; row += rowLength) {
    expect(raw[row], "rows use the None filter").toBe(0);
    rows.push(raw.subarray(row + 1, row + rowLength));
  }
  return Buffer.concat(rows);
}
