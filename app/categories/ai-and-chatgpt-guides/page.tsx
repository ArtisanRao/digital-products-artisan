"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";
import ProductActions from "@/components/ProductActions";

// Route/category slug (new)
const SLUG = "ai-and-chatgpt-guides";
// Image folder we already have on disk (kept for now)
const IMG_FOLDER = "digital-art";

type Item = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
};

const items: Item[] = [
  {
    id: "chatgpt-starter-playbook",
    slug: "chatgpt-starter-playbook",
    title: "ChatGPT Starter Playbook",
    price: 7.99,
    description: "Quickstart guide, best-practice prompts, and workflows to save hours.",
  },
  {
    id: "prompt-engineering-master-pack",
    slug: "prompt-engineering-master-pack",
    title: "Prompt Engineering Master Pack",
    price: 6.49,
    description: "Reusable prompt frameworks for writing, research, marketing and more.",
  },
  {
    id: "ai-automation-swipefile",
    slug: "ai-automation-swipefile",
    title: "AI Automation Swipefile",
    price: 8.49,
    description: "Ready-to-run SOPs to automate content, emails, and customer support.",
  },
];

const imgCandidates = (slug: string) => [
  `/images/${IMG_FOLDER}/${slug}.jpg`,
  `/images/${IMG_FOLDER}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function AIAndChatGPTGuidesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🤖 AI & ChatGPT Guides</h1>

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
          const detailHref = `/products/${encodeURIComponent(slug)}`; // ⬅️ single product page

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>

                {/* Inline “More / Less” under subtitle */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="mb-3 text-lg font-bold">{formatEUR(price)}</p>

                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                  viewHref={detailHref}      // ⬅️ View goes to the product page
                  goToCartAfterAdd={false}
                  buyEnabled={false}          // ⬅️ disable Buy here (slugs ≠ numeric productId)
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
