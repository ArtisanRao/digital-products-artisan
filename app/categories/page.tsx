"use client";

import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";
import { useState, useMemo } from "react";

/** Candidate filenames under /public/images (tries in order, falls back on error) */
const CANDIDATES_BY_SLUG: Record<string, string[]> = {
  "ai-and-chatgpt-guides":       ["ai-&-chatgpt-guides.jpg", "ai-chatgpt-guides.jpg"],
  "planners-productivity":       ["planners-&-productivity.jpg", "planners-productivity.jpg", "planners-productivity.png"],
  "self-help-and-how-to":        ["self-help-&-how-to.jpg", "self-help-how-to.jpg"],
  "plr-mrr-bundles":             ["plr-&-mrr-bundles.jpg", "plr-mrr-bundles.jpg"],
  "video-courses-and-training":  ["video-courses-&-training.jpg", "video-courses-training.jpg"],
  "complete-shop-packages":      ["complete-shop-packages.jpg"],
  "health-fitness-ebooks":       ["health-&-fitness-ebooks.jpg", "health-fitness-ebooks.jpg"],
  "keto-diet-guides":            ["keto-&-diet-guides.jpg", "keto-diet-guides.jpg"],
  "passive-income-side-hustles": ["passive-income-&-side-hustles.jpg", "passive-income-side-hustles.jpg"],
  "web-templates":               ["web-templates.jpg", "web-templates1.jpg", "web-templates2.jpg"],
  "digital-essentials-hub":      ["digital-essentials-hub.jpg", "prompt-packs-&-ai-tools.jpg", "prompt-packs-ai-tools.jpg"],
  "social-media-kits":           ["social-media-kits.jpg", "social-media-kits-cover.jpg"],
  "fonts":                       ["fonts-&-icons.jpg", "fonts.jpg"],
  "religious-ebooks":            ["religious-ebooks.jpg"],
};

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

const FALLBACK_IMG = "/images/web-templates.jpg";

function useImageFallback(slug: string) {
  const candidates = useMemo(
    () => CANDIDATES_BY_SLUG[slug]?.map((n) => `/images/${n}`) ?? [FALLBACK_IMG],
    [slug]
  );
  const [idx, setIdx] = useState(0);
  const src = candidates[idx] ?? FALLBACK_IMG;
  const onError = () => setIdx((i) => (i + 1 < candidates.length ? i + 1 : i));
  return { src, onError };
}

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => {
          const { src, onError } = useImageFallback(c.slug);
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
                  <img
                    src={src}
                    onError={onError}
                    alt={c.label}
                    className="h-full w-full object-contain p-2"
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
