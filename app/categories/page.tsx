"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";

// Per-category images living in /public/images
const IMAGE_BY_SLUG: Record<string, string> = {
  "ai-and-chatgpt-guides":      "/images/ai-chatgpt-guides.jpg",
  "planners-productivity":      "/images/planners-productivity.png", // png in repo
  "self-help-and-how-to":       "/images/self-help-how-to.jpg",
  "plr-mrr-bundles":            "/images/plr-mrr-bundles.jpg",
  "video-courses-and-training": "/images/video-courses-training.jpg",
  "complete-shop-packages":     "/images/complete-shop-packages.jpg",
  "health-fitness-ebooks":      "/images/health-fitness-ebooks.jpg",
  "keto-diet-guides":           "/images/keto-diet-guides.jpg",
  "passive-income-side-hustles":"/images/passive-income-side-hustles.jpg",
  "web-templates":              "/images/web-templates.jpg",
  "prompt-packs-and-ai-tools":  "/images/prompt-packs-ai-tools.jpg",
  "fonts":                      "/images/fonts.jpg",
  "icons":                      "/images/icons.jpg",
  // Fallbacks (add a file later if you have one):
  "social-media-kits":          "/images/categories/social-media-kits/cover.png",
};

// Short blurbs for the grid cards (optional)
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
  "Prompt Packs & AI Tools": "High-leverage prompt packs and utilities.",
  "Social Media Kits": "Post templates and brandable assets for socials.",
  "Fonts": "Display, serif, sans and script families.",
  "Icons": "Clean, scalable icon sets for brands & apps.",
};

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => {
          const img = IMAGE_BY_SLUG[c.slug] ?? "/images/web-templates.jpg"; // safe fallback
          const desc = DESC_BY_LABEL[c.label] ?? "Explore products in this category.";
          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              aria-label={`Browse ${c.label}`}
              className="
                group block rounded-2xl border overflow-hidden bg-white
                shadow transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2
              "
            >
              <CoverImage
                src={img}
                alt={c.label}
                ratio="16/9"
                fit="contain"
                paddingClass="p-2"
                roundedClass="rounded-none"
                className="md:aspect-[3/2]"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              />
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
