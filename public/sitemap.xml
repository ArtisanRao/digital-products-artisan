// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ROOT_APP_DIR = path.join(process.cwd(), "app");
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalproductsartisan.com";

// file name patterns considered as pages
const PAGE_FILE_PATTERNS = [
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
  "page.mdx",
  "page.md",
];

/**
 * Recursively walk `app` directory and collect paths that contain page files
 */
async function collectPagePaths(dir: string, base = ""): Promise<{ url: string; lastmod: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: { url: string; lastmod: string }[] = [];

  // if this directory contains a page.* file, treat base (directory path) as a route
  const hasPageFile = entries.some((e) => !e.isDirectory() && PAGE_FILE_PATTERNS.includes(e.name));
  if (hasPageFile) {
    // Root index page maps to '/'
    const urlPath = base === "" ? "/" : `/${base}`;
    // get last modified from the page file with newest mtime among page files in this directory
    let latestMtime = 0;
    for (const e of entries) {
      if (!e.isDirectory() && PAGE_FILE_PATTERNS.includes(e.name)) {
        const stat = await fs.stat(path.join(dir, e.name));
        latestMtime = Math.max(latestMtime, stat.mtimeMs);
      }
    }
    results.push({
      url: urlPath,
      lastmod: new Date(latestMtime).toISOString(),
    });
  }

  // Recurse into subdirectories (skip special dirs)
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    // skip common non-route folders
    if (
      name.startsWith("(") || // Next.js grouping folders
      name === "components" ||
      name === "api" ||
      name === "lib" ||
      name === "styles" ||
      name === "utils" ||
      name === "constants"
    ) {
      continue;
    }
    // compute new base path (append name)
    const newBase = base === "" ? name : `${base}/${name}`;
    const subDir = path.join(dir, name);
    const subResults = await collectPagePaths(subDir, newBase);
    results.push(...subResults);
  }

  return results;
}

export async function GET() {
  try {
    const pages = await collectPagePaths(ROOT_APP_DIR);

    // optionally add custom static routes you want always present (e.g. /support, /products)
    const extraRoutes: { url: string; lastmod: string }[] = [
      { url: "/support", lastmod: new Date().toISOString() },
      { url: "/products", lastmod: new Date().toISOString() },
      // add more if you keep some top-level routes outside app/
    ];

    // merge, dedupe by url (prefer page entry lastmod if available)
    const map = new Map<string, string>();
    for (const p of [...pages, ...extraRoutes]) {
      map.set(p.url, p.lastmod);
    }

    const urlEntries = Array.from(map.entries()).map(([url, lastmod]) => {
      return `<url>
  <loc>${BASE_URL}${url}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
