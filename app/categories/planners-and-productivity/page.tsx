"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const IMG_FOLDER = "printable-planners"; // keep existing images/folder

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const items: Item[] = [
  {
    id: "printable-planners",
    slug: "printable-planners",
    title: "All-in-One Printable Planner Bundle",
    price: 8.99,
    description: "Daily, weekly, monthly and habit trackers in one bundle.",
  },
  {
    id: "daily-planner",
    slug: "daily-planner",
    title: "Daily Planner",
    price: 4.49,
    description: "Plan your day with priorities, schedule and notes.",
  },
  {
    id: "budget-planner",
    slug: "budget-planner",
    title: "Budget Planner",
    price: 5.49,
    description: "Track income, expenses and savings with printable sheets.",
  },
];

// Multiple sensible filenames (+ fallbacks)
const imgCandidates = (slug: string) => [
  `/images/${IMG_FOLDER}/${slug}.jpg`,
  `/images/${IMG_FOLDER}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${IMG_FOLDER}/cover.jpg`,
  `/images/${IMG_FOLDER}-cover.jpg`,
  `/images/printable-planners-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function PlannersAndProductivityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🗓️ Planners & Productivity</h1>

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
          const detailHref = `/products/${encodeURIComponent(slug)}`; // ← single product URL

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>

                {/* Inline “More / Less” under subtitle — force visible */}
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
                  viewHref={detailHref}          // ← make “View” go to single product page
                  goToCartAfterAdd={false}
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
