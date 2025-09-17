"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

const CAT = "audio-samples";

type Item = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
};

const items: Item[] = [
  { id: "audio-samples",  slug: "audio-samples",                  title: "Audio Samples Bundle", price: 7.49, description: "Loops, SFX, and risers." },
  { id: "sonic-spectrum", slug: "sonic-spectrum",                 title: "Sonic Spectrum",       price: 6.99, description: "Wide variety of textures." },
  { id: "animated-titles-and-animations", slug: "animated-titles-and-animations", title: "Animated Titles FX",   price: 5.99, description: "Audio accents for titles." },
  // add more here; the grid will auto-expand with Read more
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
        // two rows by default per breakpoint (from the component’s defaults)
        items={items}
        renderItem={(p) => {
          const primaryImg = `/images/${CAT}/${p.slug}.jpg`; // used for cart/checkout
          return (
            <div
              key={p.id}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(p.slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                <p className="text-lg font-bold">{formatEUR(p.price)}</p>

                <ShopActions
                  item={{
                    id: p.slug,
                    title: p.title,
                    price: p.price,
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
