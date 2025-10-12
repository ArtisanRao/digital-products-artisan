// scripts/patch-package-json.mjs
import fs from "node:fs";

const path = "package.json";
let raw = fs.readFileSync(path, "utf8");

// Strip common accidental comments (// ... and /* ... */) if any
raw = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");

let pkg;
try {
  pkg = JSON.parse(raw);
} catch (e) {
  console.error("❌ Still invalid JSON. Open package.json and remove comments/trailing commas.");
  throw e;
}

pkg.scripts = pkg.scripts || {};
pkg.scripts.prebuild = pkg.scripts.prebuild || "tsx scripts/validate-products.ts";
pkg.scripts["lint:products"] = pkg.scripts["lint:products"] || "tsx scripts/validate-products.ts";

pkg.dependencies = pkg.dependencies || {};
pkg.devDependencies = pkg.devDependencies || {};

pkg.dependencies.zod = pkg.dependencies.zod || "^3.23.8";
pkg.devDependencies.tsx = pkg.devDependencies.tsx || "^4.16.0";

pkg.engines = pkg.engines || {};
pkg.engines.node = pkg.engines.node || "22.x";

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n");
console.log("✅ package.json patched.");
