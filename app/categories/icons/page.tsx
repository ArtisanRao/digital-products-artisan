'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

type IconItem = {
  slug: string; // used to generate candidate paths
  title: string;
  price: number;
  description: string;
};

export default function IconsPage() {
  const items: IconItem[] = [
    {
      slug: 'ui-icon-pack',
      title: 'UI Icon Pack',
      price: 4.99,
      description: '500 crisp UI icons in SVG + PNG.',
    },
    {
      slug: 'minimal-icons',
      title: 'Minimal Icons',
      price: 3.99,
      description: 'Clean, thin-line icons great for dashboards.',
    },
    {
      slug: 'gradient-icons',
      title: 'Gradient Icons',
      price: 5.49,
      description: 'Vibrant, modern gradient-styled icons.',
    },
  ];

  return (
    <>
      <Head>
        <title>Icons | Digital Products Artisan</title>
        <meta name="description" content="UI, minimal, and gradient icon packs for your projects." />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🟣 Icons</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            // Try multiple filename shapes and locations:
            const candidates = [
              `/images/icons/${item.slug}.jpg`,
              `/images/icons/${item.slug}-cover.jpg`,
              `/images/${item.slug}.jpg`,
              `/images/${item.slug}-cover.jpg`,
            ];

            return (
              <div key={item.slug} className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group">
                <HoverableCover
                  srcs={candidates}
                  alt={item.title}
                  ratio="1/1"
                  fit="contain"
                />

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                  <button
                    className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    data-item-id={item.slug}
                    data-item-name={item.title}
                    data-item-price={item.price}
                    data-item-url="/categories/icons"
                    data-item-description={item.description}
                    // Use the first candidate as the purchase image; Snipcart doesn’t need fallbacks
                    data-item-image={candidates[0]}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
