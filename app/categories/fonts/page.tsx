'use client';

import HoverableCover from '@/components/ui/hoverable-cover';

type Item = { slug: string; title: string; price: number; description: string };
const CAT = 'fonts';
const img = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
];

export default function FontsPage() {
  const items: Item[] = [
    { slug: 'fonts', title: 'Fonts Starter Pack', price: 3.99, description: 'Stylish fonts for headers & logos.' },
    { slug: 'handwritten-script-pack', title: 'Handwritten Script Pack', price: 4.49, description: 'Warm, organic vibe.' },
    { slug: 'elegant-serif-pack', title: 'Elegant Serif Pack', price: 4.99, description: 'Timeless sophistication.' },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🔤 Fonts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => (
          <div key={p.slug} className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group">
            <HoverableCover srcs={img(p.slug)} alt={p.title} ratio="16/9" fit="contain" />
            <div className="p-4"><h2 className="text-xl font-semibold mb-2">{p.title}</h2><p className="text-gray-600 text-sm mb-2">{p.description}</p><p className="text-lg font-bold">€{p.price.toFixed(2)}</p></div>
          </div>
        ))}
      </div>
    </main>
  );
}
