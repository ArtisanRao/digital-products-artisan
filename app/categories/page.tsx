"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";

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

// Derive image path; one convention
const imageFor = (slug: string) => `/images/categories/${slug}/cover.jpg`;

export default function CategoriesPage() {
  const categories = CATEGORIES.map(({ label, slug }) => ({
    name: `${emojiBySlug[slug] ?? "📁"} ${label}`,
    slug,
    image: imageFor(slug),
    desc: descBySlug[slug] ?? label,
    plainLabel: label,
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            aria-label={`Browse ${category.plainLabel}`}
            className="group block rounded-2xl border overflow-hidden bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
          >
            <CoverImage
              src={category.image}
              alt={category.plainLabel}
              ratio="16/9"
              fit="cover"
              paddingClass="p-0"
              roundedClass="rounded-none"
              className="md:aspect-[3/2]"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
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
