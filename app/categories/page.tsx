"use client";

import { useState } from "react";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";

/** Try an override, then multiple filename patterns in both folders, then default. */
function CategoryCover({
  slug,
  alt,
  overrideSrc,
}: {
  slug: string;
  alt: string;
  overrideSrc?: string;
}) {
  const ver = process.env.NEXT_PUBLIC_ASSET_VERSION ?? "v1";

  // If you pass an explicit image in data/categories.ts, try that first.
  const candidates: string[] = [
    ...(overrideSrc ? [overrideSrc] : []),

    // Preferred structure: per-category folder
    `/images/categories/${slug}/cover.webp`,
    `/images/categories/${slug}/cover.avif`,
    `/images/categories/${slug}/cover.png`,
    `/images/categories/${slug}/cover.jpg`,
    `/images/categories/${slug}/hero.webp`,
    `/images/categories/${slug}/hero.avif`,
    `/images/categories/${slug}/hero.png`,
    `/images/categories/${slug}/hero.jpg`,

    // Flat structure: single file in /public/images
    `/images/${slug}.webp`,
    `/images/${slug}.avif`,
    `/images/${slug}.png`,
    `/images/${slug}.jpg`,
  ];

  const fallback = "/images/categories/_default/cover.png"; // ensure this exists
  const [idx, setIdx] = useState(0);
  const pick = idx < candidates.length ? candidates[idx] : fallback;
  const src = `${pick}?${ver}`;

  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[16/9] w-full rounded-none object-cover md:aspect-[3/2]"
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

// Emoji per category slug
const emojiBySlug: Record<string, string> = {
  "ai-chatgpt-guides": "🤖",
  "planners-productivity": "🗓️",
  "self-help-how-to": "📘",
  "plr-mrr-bundles": "📦",
  "video-courses-training": "🎥",
  "complete-shop-packages": "🧰",
  "health-fitness-ebooks": "📚",
  "keto-diet-guides": "🥑",
  "passive-income-side-hustles": "💸",
  "web-templates": "🌐",
  "prompt-packs-ai-tools": "🧠",
  "fonts": "🔤",
  "icons": "🔘",
};

// Short description per category slug
const descBySlug: Record<string, string> = {
  "ai-chatgpt-guides": "Playbooks, prompts, and AI workflows.",
  "planners-productivity": "Planners, journals, and focus tools.",
  "self-help-how-to": "Guides to improve skills and habits.",
  "plr-mrr-bundles": "Rebrand & resell with PLR/MRR licenses.",
  "video-courses-training": "Step-by-step video lessons & workshops.",
  "complete-shop-packages": "Turnkey store bundles ready to sell.",
  "health-fitness-ebooks": "Wellness, strength, and habit guides.",
  "keto-diet-guides": "Meal plans, recipes, and trackers.",
  "passive-income-side-hustles": "Systems and strategies to earn online.",
  "web-templates": "Site themes, UI kits, and components.",
  "prompt-packs-ai-tools": "Reusable prompt packs and utilities.",
  "fonts": "Display, serif, sans & script collections.",
  "icons": "Clean, scalable icons for UI & brand.",
};

export default function CategoriesPage() {
  // If you add { image: "/images/<something>.webp" } per category in data/categories.ts,
  // we’ll use it as overrideSrc automatically.
  const categories = CATEGORIES.map((c: any) => ({
    name: `${emojiBySlug[c.slug] ?? "📁"} ${c.label}`,
    slug: c.slug,
    desc: descBySlug[c.slug] ?? c.label,
    plainLabel: c.label,
    overrideSrc: typeof c.image === "string" ? c.image : undefined,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="mb-12 text-center text-4xl font-bold">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            aria-label={`Browse ${category.plainLabel}`}
            className="group block overflow-hidden rounded-2xl border bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
          >
            <CategoryCover
              slug={category.slug}
              alt={category.plainLabel}
              overrideSrc={category.overrideSrc}
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600">
                {category.name}
              </h2>

              <InlineMore
                text={category.desc}
                lines={2}
                minChars={1}
                className="mt-1 text-sm text-gray-600"
                moreLabel="more"
                lessLabel="less"
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
