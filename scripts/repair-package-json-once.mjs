import fs from "node:fs";

const path = "package.json";
let raw = fs.readFileSync(path, "utf8");

// 1) Strip JS-style comments just in case
raw = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");

// 2) Walk the text to find where a second root `{` starts after depth returns to 0.
//    When we detect:  "}(whitespace){", replace that boundary with a comma so the
//    second object’s keys become part of the first root object.
function mergeSecondRootObject(txt) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];

    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === "\\") {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }

    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);

    // We found the *end* of the first root object when depth becomes 0 after a '}'
    if (depth === 0 && ch === "}") {
      // Look ahead for whitespace + '{'
      const rest = txt.slice(i + 1);
      const m = rest.match(/^\s*{/);
      if (m) {
        const start = i + 1;
        const end = i + 1 + m[0].length; // covers whitespace + '{'
        // Replace the boundary "}\s*{" with ","
        return txt.slice(0, start) + "," + txt.slice(end);
      } else {
        // no second root; return as-is
        return txt;
      }
    }
  }
  return txt;
}

let fixed = mergeSecondRootObject(raw);

// 3) Try parse; if it fails, try removing obvious trailing commas.
function tryParse(txt) {
  try { return JSON.parse(txt); } catch (e) { return null; }
}

let parsed = tryParse(fixed);
if (!parsed) {
  // Remove trailing commas before } or ]
  fixed = fixed.replace(/,(\s*[}\]])/g, "$1");
  parsed = tryParse(fixed);
}

if (!parsed) {
  console.error("❌ Could not automatically repair package.json. Please open it and ensure it has a single root { ... } with no trailing commas.");
  process.exit(1);
}

// 4) Write back nicely formatted
fs.writeFileSync(path, JSON.stringify(parsed, null, 2) + "\n");
console.log("✅ package.json repaired.");
