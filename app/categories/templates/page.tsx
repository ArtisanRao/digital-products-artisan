"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;
  description: string;
  image: string;
};

const CAT = "templates";
const primary = (slug: string) => `/images/${CAT}/${slug}.jpg`;

const items: Item[] = [
  {
    id: "invoice-template",
    slug: "invoice-template",
    title: "Invoice Template Kit",
    price: 5.49,
    description: "Clean, professional invoices.",
    image: primary("invoice-template"),
  },
  {
    id: "presentation-deck-template",
    slug: "presentation-deck-template",
    title: "Presentation Deck Template",
    price: 6.49,
    description: "Modern slide layouts for anything.",
    image: primary("presentation-deck-template"),
  },
  {
    id: "resume-template",
    slug: "resume-template",
    title: "Ultimate Resume Template",
    price: 6.99,
    description: "ATS-friendly resume with cover letter.",
    image: primary("resume-template"),
  },
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function TemplatesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧾 Templates</h1>

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
          const image = typeof p.image === "string" ? p.image : primary(slug);

          return (
            <div
              key={String(p.id)}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              {/* Hoverable, perfectly-fit cover */}
              <HoverableCover src={image} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>

                {/* Inline “More / Less” under subtitle — always show trigger */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                {/* View (checkout) + Add to Cart (opens cart with badge) */}
                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image,
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
