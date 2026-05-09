import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "node_modules", "threejs-components", "build", "cursors", "tubes1.min.js");
const destDir = path.join(root, "public", "vendor");
const dest = path.join(destDir, "tubes1.min.js");

if (!fs.existsSync(src)) {
  console.warn("[copy-tubes-asset] Skip: threejs-components cursor bundle not found at", src);
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("[copy-tubes-asset] Wrote", path.relative(root, dest));
