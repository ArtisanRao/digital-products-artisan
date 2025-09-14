'use client';

import HoverableCover from '@/components/ui/hoverable-cover';

type Item = { slug: string; title: string; price: number; description: string };
const CAT = 'web-templates';
const img = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
];

export default function WebTemplatesPage() {
  const items: Item[] = [
    { slug: 'web-templates', title: 'Web Templates Bundle', price: 9.99, description: 'Landing pages, blogs & more.' },
    { slug: 'contract-templates', title: 'Contract Templates', price: 5.49, description: 'Professional legal templates.' },
    { slug: 'excel-tracker', title: 'Excel Tracker', price: 4.99, description: 'Track KPI, finances, goals.' },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🌐 Web Templates</h1>
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
