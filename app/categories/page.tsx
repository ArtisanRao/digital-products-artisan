"use client";

import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";
import { useMemo, useState } from "react";
import CatLink from "@/components/ui/CatLink"; // no-prefetch wrapper
import ClickUnlocker from "@/components/debug/ClickUnlocker"; // 🔓 overlay guard

/** Optional descriptions */
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
  "Fonts & Icons": "Font families and icon sets for brands & apps.",
  "Religious eBooks": "Faith-centered books, devotionals, and study guides.",
};

const GLOBAL_FALLBACKS = [
  "/images/categories/_default/card.jpg",
  "/images/placeholder.jpg",
];

// Read the build tag set by app/layout.tsx (<body data-ui-build="...">)
function useBuildTag() {
  const tag =
    (typeof document !== "undefined" && document.body?.dataset?.uiBuild) ||
    (process.env.NEXT_PUBLIC_BUILD_TAG as string) ||
    "catlinks-2025-09-26-f";
  return tag;
}

/* ---------- helpers: category card image with fallbacks ---------- */

function buildCandidates(slug: string, image?: string): string[] {
  const list: string[] = [];
  if (image) {
    list.push(image);
    if (/\.jpe?g$/i.test(image)) {
      list.push(image.replace(/\.jpe?g$/i, ".png"));
      list.push(image.replace(/\.jpe?g$/i, ".webp"));
    } else if (/\.png$/i.test(image)) {
      list.push(image.replace(/\.png$/i, ".jpg"));
      list.push(image.replace(/\.png$/i, ".webp"));
    } else if (/\.webp$/i.test(image)) {
      list.push(image.replace(/\.webp$/i, ".jpg"));
      list.push(image.replace(/\.webp$/i, ".png"));
    }
  }
  // Curated cover only
  const base = `/images/categories/${slug}/card`;
  list.push(`${base}.jpg`, `${base}.png`, `${base}.webp`);
  list.push(...GLOBAL_FALLBACKS);
  return Array.from(new Set(list));
}

function useCategoryImage(slug: string, image?: string) {
  const candidates = useMemo(() => buildCandidates(slug, image), [slug, image]);
  const [idx, setIdx] = useState(0);
  const src = candidates[idx] ?? GLOBAL_FALLBACKS[0];
  const onError = () => setIdx((i) => (i + 1 < candidates.length ? i + 1 : i));
  return { src, onError };
}

/* ------------------------------- page ------------------------------- */

export default function CategoriesPage() {
  const BUILD_TAG = useBuildTag();

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
          const { src, onError } = useCategoryImage(c.slug, (c as any).image);
          const desc = DESC_BY_LABEL[c.label] ?? "Explore products in this category.";

          // Bust both link HTML and image cache using the same tag
          const href = `/categories/${c.slug}?v=${encodeURIComponent(BUILD_TAG)}`;
          const imgSrc = src.includes("?") ? `${src}&v=${BUILD_TAG}` : `${src}?v=${BUILD_TAG}`;

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
                    onError={onError}
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
