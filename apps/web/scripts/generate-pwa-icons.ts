import { mkdirSync, writeFileSync } from "node:fs";
import { pwaIcons, renderPwaIcon } from "./pwa-icons.ts";

const publicDir = new URL("../public/", import.meta.url);

mkdirSync(publicDir, { recursive: true });
for (const icon of pwaIcons) {
  writeFileSync(new URL(icon.file, publicDir), renderPwaIcon(icon.size));
}
