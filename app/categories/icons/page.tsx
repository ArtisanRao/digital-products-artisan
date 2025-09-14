'use client';

import HoverableCover from '@/components/ui/hoverable-cover';
import ShopActions from '@/components/shop-actions';

type Item = { slug: string; title: string; price: number; description: string };

const CAT = 'icons';

// Try multiple sensible filenames (category folder, root, -cover variants) + safe fallbacks
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/icons-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

export default function IconsPage() {
  const items: Item[] = [
    {
      slug: 'minimal-icons-pack',
      title: 'Minimal Icons Pack',
      price: 4.99,
      description: 'Clean, consistent 24px line icons for interfaces.',
    },
    {
      slug: 'business-icons-pack',
      title: 'Business Icons Pack',
      price: 5.49,
      description: 'Office, finance & analytics icons for dashboards.',
    },
    {
      slug: 'social-icons-pack',
      title: 'Social Media Icons',
      price: 3.99,
      description: 'Brand-safe logos in multiple styles and sizes.',
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🔘 Icons</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          // Primary image used for cart/checkout + first attempt
          const primaryImg = `/images/${CAT}/${p.slug}.jpg`;

          return (
            <div
              key={p.slug}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              {/* Square looks best for icon sets */}
              <HoverableCover srcs={imgCandidates(p.slug)} alt={p.title} ratio="1/1" fit="contain" />

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
