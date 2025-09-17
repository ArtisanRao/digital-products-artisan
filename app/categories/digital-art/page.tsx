"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

const CAT = "digital-art";

type Item = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
};

const items: Item[] = [
  { id: "digital-art", slug: "digital-art", title: "Digital Art Collection", price: 7.99, description: "High-res artwork for personal & commercial use." },
  { id: "abstract-art-pack", slug: "abstract-art-pack", title: "Abstract Art Pack", price: 6.49, description: "Bold shapes, gradients, and textures." },
  { id: "poster-collection", slug: "poster-collection", title: "Poster Collection", price: 8.49, description: "Print-ready poster designs in multiple sizes." },
  // add more as needed
];

const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function DigitalArtPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🎨 Digital Art</h1>

      <CategoryGrid
        items={items}
        // shows two rows by default per breakpoint; reveals more with "Read more"
        renderItem={(p) => {
          // Normalize types for strict TS (CategoryGrid's Product has optional fields)
          const slug = p.slug ?? String(p.id);
          const price =
            typeof p.price === "number"
              ? p.price
              : typeof p.price === "string"
              ? parseFloat(p.price)
              : 0;

          const primaryImg = `/images/${CAT}/${slug}.jpg`;

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>
                <p className="mb-2 text-sm text-gray-600">{p.description}</p>
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
