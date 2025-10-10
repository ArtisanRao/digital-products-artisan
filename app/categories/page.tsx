// app/categories/page.tsx — Server Component (no "use client")
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";
import CatLink from "@/components/ui/CatLink";               // client ok inside server
import ClickUnlocker from "@/components/debug/ClickUnlocker"; // client ok inside server

type SP = Record<string, string | string[] | undefined>;

// Optional descriptions
const DESC_BY_LABEL: Record<string, string> = {
  "AI & ChatGPT Guides": "Actionable guides, prompts and workflows to build with AI.",
  "Planners & Productivity": "Digital planners, journals and organization systems.",
  "Self-Help & How-To": "Practical guides, routines and step-by-step tutorials.",
  "PLR & MRR Bundles": "Rebrandable products with resale rights (PLR/MRR).",
  "Video Courses & Training": "Structured video lessons and skill accelerators.",
  "Complete Shop Packages": "Ready-made storefront bundles to launch fast.",
  "Health & Fitness eBooks": "Nutrition, training and healthy living guides.",
  "Keto & Diet Guides": "Low-carb & diet frameworks, recipes and tips.",
  "Passive Income & Side Hustles": "Repeatable systems for income outside 9-to-5.",
  "Web Templates": "Website, UI kits and theme starters.",
  "Digital Essentials Hub": "Prompt packs, automations, and utilities.",
  "Social Media Kits": "Post templates and brandable assets for socials.",
  "Fonts & Icons": "Font families and icon sets.",
  "Religious eBooks": "Faith-centered books, devotionals, and study guides.",
};

const GLOBAL_FALLBACKS = [
  "/images/categories/_default/card.jpg",
  "/images/placeholder.jpg",
];

// Build tag for cache-busting (prefer env; fallback constant)
const BUILD_TAG = process.env.NEXT_PUBLIC_BUILD_TAG || "catlinks-2025-09-26-f";

// Build a list of candidate images for a category
function buildCandidates(slug: string, image?: string): string[] {
  const list: string[] = [];
  if (image) {
    list.push(image);
    if (/\.jpe?g$/i.test(image)) list.push(image.replace(/\.jpe?g$/i, ".png"), image.replace(/\.jpe?g$/i, ".webp"));
    else if (/\.png$/i.test(image)) list.push(image.replace(/\.png$/i, ".jpg"), image.replace(/\.png$/i, ".webp"));
    else if (/\.webp$/i.test(image)) list.push(image.replace(/\.webp$/i, ".jpg"), image.replace(/\.webp$/i, ".png"));
  }
  const base = `/images/categories/${slug}/card`;
  list.push(`${base}.jpg`, `${base}.png`, `${base}.webp`);
  list.push(...GLOBAL_FALLBACKS);
  // dedupe
  return Array.from(new Set(list));
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  // Read query params on the server
  const sp = (await searchParams) || {};
  const spEntries = Object.entries(sp).filter(([_, v]) => v != null && v !== "");

  // Preserve existing params and add cache-busting tag
  const qs = new URLSearchParams(
    [...spEntries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v as string)]), ["v", BUILD_TAG]]
  ).toString();

  return (
    <main
      className="relative z-[100] max-w-7xl mx-auto px-4 py-12"
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* 🔓 Neutralize any overlays sitting above the grid */}
      <ClickUnlocker targetSelector="#categories-grid" />

      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div
        id="categories-grid"
        data-click-scope="categories"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        style={{ pointerEvents: "auto" }}
      >
        {CATEGORIES.map((c) => {
          const desc = DESC_BY_LABEL[c.label] ?? "Explore products in this category.";
          const pathname = `/categories/${encodeURIComponent(c.slug)}`; // single slash
          const href = qs ? `${pathname}?${qs}` : pathname;

          // choose first viable image (server-side; no onError swapping)
          const candidates = buildCandidates(c.slug, (c as any).image);
          const src0 = candidates[0] || GLOBAL_FALLBACKS[0];
          const imgSrc = src0.includes("?") ? `${src0}&v=${BUILD_TAG}` : `${src0}?v=${BUILD_TAG}`;

          return (
            <CatLink
              key={c.slug}
              href={href}
              aria-label={`Browse ${c.label}`}
              className="group relative z-20 block rounded-2xl border overflow-hidden bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
              style={{ pointerEvents: "auto" }}
            >
              <div className="relative w-full bg-gray-50">
                <div className="aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={c.label}
                    className="h-full w-full object-cover pointer-events-none select-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600">
                  {c.label}
                </h2>
                <InlineMore
                  text={desc}
                  lines={2}
                  minChars={1}
                  className="mt-1 text-sm text-gray-600"
                  moreLabel="more"
                  lessLabel="less"
                />
              </div>
            </CatLink>
          );
        })}
      </div>
    </main>
  );
}
