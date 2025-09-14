"use client";

import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

type Item = {
  slug: string;
  title: string;
  price: number;
  description: string;
  image: string;
};

const CAT = "templates";
const primary = (slug: string) => `/images/${CAT}/${slug}.jpg`;

export default function TemplatesPage() {
  const items: Item[] = [
    {
      slug: "invoice-template",
      title: "Invoice Template Kit",
      price: 5.49,
      description: "Clean, professional invoices.",
      image: primary("invoice-template"),
    },
    {
      slug: "presentation-deck-template",
      title: "Presentation Deck Template",
      price: 6.49,
      description: "Modern slide layouts for anything.",
      image: primary("presentation-deck-template"),
    },
    {
      slug: "resume-template",
      title: "Ultimate Resume Template",
      price: 6.99,
      description: "ATS-friendly resume with cover letter.",
      image: primary("resume-template"),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧾 Templates</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => (
          <div
            key={p.slug}
            className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
          >
            {/* Hoverable, perfectly-fit cover (same behavior as Marketing Tools) */}
            <HoverableCover src={p.image} alt={p.title} ratio="16/9" fit="contain" />

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{p.description}</p>
              <p className="text-lg font-bold mb-3">€{p.price.toFixed(2)}</p>

              {/* Blue View + Add to Cart actions */}
              <ShopActions
                item={{
                  id: p.slug,
                  title: p.title,
                  price: p.price,
                  image: p.image,
                  description: p.description,
                  // fileUrl: "/downloads/..."  // add if/when you have downloadable zips for these
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
