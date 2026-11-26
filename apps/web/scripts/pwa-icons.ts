import { designTokens } from "@streetthai/ui";
import { deflateSync } from "node:zlib";

export type PwaIcon = {
  file: string;
  size: number;
};

/**
 * Every PNG icon the PWA ships from `apps/web/public`.
 */
export const pwaIcons = [
  { file: "pwa-192x192.png", size: 192 },
  { file: "pwa-512x512.png", size: 512 },
  { file: "maskable-512x512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
] as const satisfies readonly PwaIcon[];

/**
 * Renders the placeholder app icon as an opaque RGB PNG: a surface-colored ring on the accent
 * color, kept inside the maskable safe zone so every platform mask shows all of it.
 */
export function renderPwaIcon(size: number): Buffer {
  const background = hexToRgb(designTokens.color.accent);
  const foreground = hexToRgb(designTokens.color.surface);
  const center = (size - 1) / 2;
  const outer = size * 0.3;
  const inner = size * 0.18;
  const rowLength = 1 + size * 3;
  const raw = Buffer.alloc(rowLength * size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const distance = Math.hypot(x - center, y - center);
      const color = distance <= outer && distance >= inner ? foreground : background;
      raw.set(color, y * rowLength + 1 + x * 3);
    }
  }
  return Buffer.concat([
    pngSignature,
    chunk("IHDR", header(size)),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function header(size: number): Buffer {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(size, 0);
  data.writeUInt32BE(size, 4);
  data.writeUInt8(8, 8);
  data.writeUInt8(2, 9);
  return data;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = (crcTable[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function hexToRgb(hex: string): number[] {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}
