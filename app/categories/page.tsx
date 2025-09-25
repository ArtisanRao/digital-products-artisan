"use client";

import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";
import { useMemo, useState } from "react";

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
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => {
          const { src, onError } = useCategoryImage(c.slug, (c as any).image);
          const desc = DESC_BY_LABEL[c.label] ?? "Explore products in this category.";

          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              aria-label={`Browse ${c.label}`}
              className="group block rounded-2xl border overflow-hidden bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
            >
              <div className="relative w-full bg-gray-50">
                <div className="aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    onError={onError}
                    alt={c.label}
                    className="h-full w-full object-cover"
                    loading="lazy"
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
            </Link>
          );
        })}
      </div>
    </main>
  );
}
