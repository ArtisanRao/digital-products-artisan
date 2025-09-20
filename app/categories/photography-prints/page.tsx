"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const CAT = "photography-prints";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const items: Item[] = [
  { id: "photography-prints", slug: "photography-prints", title: "Photography Prints",    price: 9.99, description: "Curated high-resolution prints." },
  { id: "mystery-thriller-novel", slug: "mystery-thriller-novel", title: "Moody Noir Poster", price: 7.99, description: "Atmospheric, cinematic artwork." },
  { id: "landscape-pack", slug: "landscape-pack", title: "Landscape Pack", price: 8.49, description: "Crisp outdoor scenes for décor." },
];

const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function PhotographyPrintsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📸 Photography Prints</h1>

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

          const primaryImg = `/images/${CAT}/${slug}.jpg`;
          const detailHref = `/products/${encodeURIComponent(slug)}`; // ← route to single product page

          return (
            <div
              key={String(p.id)}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>

                {/* Inline “More / Less” under subtitle (force show) */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                {/* Blue View + Add to Cart */}
                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                  viewHref={detailHref}
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
