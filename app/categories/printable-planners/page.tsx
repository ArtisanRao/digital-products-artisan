'use client';

import HoverableCover from '@/components/ui/hoverable-cover';
import ShopActions from '@/components/shop-actions';

type Item = { slug: string; title: string; price: number; description: string };

const CAT = 'printable-planners';

// Try several sensible image filenames (category folder, root, -cover variants, and a final placeholder)
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/printable-planners-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

export default function PrintablePlannersPage() {
  const items: Item[] = [
    {
      slug: 'printable-planners',
      title: 'All-in-One Printable Planner Bundle',
      price: 8.99,
      description: 'Daily, weekly, monthly and habit trackers in one bundle.',
    },
    {
      slug: 'daily-planner',
      title: 'Daily Planner',
      price: 4.49,
      description: 'Plan your day with priorities, schedule and notes.',
    },
    {
      slug: 'budget-planner',
      title: 'Budget Planner',
      price: 5.49,
      description: 'Track income, expenses and savings with printable sheets.',
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🗓️ Printable Planners</h1>

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
