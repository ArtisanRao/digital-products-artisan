'use client';

import HoverableCover from '@/components/ui/hoverable-cover';
import ShopActions from '@/components/shop-actions';

type Item = { slug: string; title: string; price: number; description: string };
const CAT = 'video-resources';

// Try multiple sensible filenames (category folder, root, and -cover variants)
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/video-resources-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

export default function VideoResourcesPage() {
  const items: Item[] = [
    { slug: 'video-resources',            title: 'Video Resources Hub',        price: 8.99,  description: 'B-roll, lower thirds, overlays.' },
    { slug: 'stock-footage-mega-bundle',  title: 'Stock Footage Mega Bundle',  price: 12.99, description: 'Huge, royalty-free stock set.' },
    { slug: 'youtube-channel-kit',        title: 'YouTube Channel Kit',        price: 6.49,  description: 'Intros, end screens, thumbnails.' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎥 Video Resources</h1>

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
