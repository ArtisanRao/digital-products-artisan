'use client';

import HoverableCover from '@/components/ui/hoverable-cover';
import ShopActions from '@/components/shop-actions';

type Item = { slug: string; title: string; price: number; description: string };
const CAT = 'audio-samples';

// Try multiple filename candidates (category folder, root, and -cover variants)
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

export default function AudioSamplesPage() {
  const items: Item[] = [
    { slug: 'audio-samples',                 title: 'Audio Samples Bundle', price: 7.49, description: 'Loops, SFX, and risers.' },
    { slug: 'sonic-spectrum',                title: 'Sonic Spectrum',       price: 6.99, description: 'Wide variety of textures.' },
    { slug: 'animated-titles-and-animations',title: 'Animated Titles FX',   price: 5.99, description: 'Audio accents for titles.' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎵 Audio Samples</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => {
          // Primary path used for cart/checkout image
          const primaryImg = `/images/${CAT}/${p.slug}.jpg`;

          return (
            <div
              key={p.slug}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(p.slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                <p className="text-lg font-bold">€{p.price.toFixed(2)}</p>

                {/* Blue View + Add to Cart buttons */}
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
        })}
      </div>
    </main>
  );
}
