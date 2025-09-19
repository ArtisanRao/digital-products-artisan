"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const IMG_FOLDER = "fonts"; // keep existing images for now

type Item = {
  id: string;          // ensure an id so CategoryGrid keys cleanly
  slug: string;
  title: string;
  price: number;       // keep as number here
  description: string;
};

const items: Item[] = [
  {
    id: "keto-starter-meal-plan",
    slug: "keto-starter-meal-plan",
    title: "Keto Starter Meal Plan (14 Days)",
    price: 4.99,
    description: "Beginner-friendly menus, recipes, and grocery lists.",
  },
  {
    id: "low-carb-recipe-pack",
    slug: "low-carb-recipe-pack",
    title: "Low-Carb Recipe Pack",
    price: 5.49,
    description: "30 quick recipes with macros and prep notes.",
  },
  {
    id: "intermittent-fasting-guide",
    slug: "intermittent-fasting-guide",
    title: "Intermittent Fasting Guide",
    price: 5.99,
    description: "Schedules, checklists, and progress tracker.",
  },
  // add more; expander will handle the rest
];

// Try multiple sensible filenames (category folder, root, -cover variants) + safe fallbacks
const imgCandidates = (slug: string) => [
  `/images/${IMG_FOLDER}/${slug}.jpg`,
  `/images/${IMG_FOLDER}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${IMG_FOLDER}/cover.jpg`,
  `/images/${IMG_FOLDER}-cover.jpg`,
  `/images/fonts-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function KetoAndDietGuidesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🥗 Keto & Diet Guides</h1>

      <CategoryGrid
        items={items}
        renderItem={(p) => {
          const slug = p.slug ?? String(p.id);
          const price =
            typeof p.price === "number"
              ? p.price
              : typeof p.price === "string"
              ? parseFloat(p.price)
              : 0;

          const primaryImg = `/images/${IMG_FOLDER}/${slug}.jpg`;

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>

                {/* Inline “More / Less” under subtitle (force show) */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="mb-2 text-sm text-gray-600"
                />

                <p className="mb-3 text-lg font-bold">{formatEUR(price)}</p>

                {/* Blue View + Add to Cart (consistent site-wide) */}
                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
