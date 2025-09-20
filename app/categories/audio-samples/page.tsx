"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const CAT = "audio-samples";

type Item = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
};

const items: Item[] = [
  { id: "audio-samples", slug: "audio-samples", title: "Audio Samples Bundle", price: 7.49, description: "Loops, SFX, and risers." },
  { id: "sonic-spectrum", slug: "sonic-spectrum", title: "Sonic Spectrum", price: 6.99, description: "Wide variety of textures." },
  { id: "animated-titles-and-animations", slug: "animated-titles-and-animations", title: "Animated Titles FX", price: 5.99, description: "Audio accents for titles." },
];

const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/audio-samples-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function AudioSamplesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎵 Audio Samples</h1>

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
          const detailHref = `/products/${encodeURIComponent(slug)}`; // ← single product page

          return (
            <div
              key={String(p.id)}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>

                {/* Inline “More / Less” under subtitle – force visible for short blurbs */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold">{formatEUR(price)}</p>

                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                  viewHref={detailHref}        // ← View goes to product page
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
