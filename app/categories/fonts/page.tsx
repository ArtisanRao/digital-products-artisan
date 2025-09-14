'use client';

import HoverableCover from '@/components/ui/hoverable-cover';
import ShopActions from '@/components/shop-actions';

type Item = { slug: string; title: string; price: number; description: string };

const CAT = 'fonts';

// Try multiple sensible filenames (category folder, root, -cover variants) + safe fallbacks
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/fonts-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

export default function FontsPage() {
  const items: Item[] = [
    {
      slug: 'modern-sans-font',
      title: 'Modern Sans Font',
      price: 4.99,
      description: 'Clean geometric sans — perfect for UI and branding.',
    },
    {
      slug: 'handwritten-script-font',
      title: 'Handwritten Script',
      price: 5.49,
      description: 'Casual, friendly script with elegant alternates.',
    },
    {
      slug: 'display-title-font',
      title: 'Display Title Font',
      price: 5.99,
      description: 'Bold headline display with personality.',
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🔤 Fonts</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          // Primary image used for cart/checkout + first attempt in UI
          const primaryImg = `/images/${CAT}/${p.slug}.jpg`;

          return (
            <div
              key={p.slug}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(p.slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>
                <p className="mb-2 text-sm text-gray-600">{p.description}</p>
                <p className="mb-3 text-lg font-bold">€{p.price.toFixed(2)}</p>

                {/* Blue View + Add to Cart (consistent site-wide) */}
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
