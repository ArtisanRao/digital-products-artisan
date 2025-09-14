'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function IconsPage() {
  const items = [
    {
      id: 'ui-icon-pack',
      title: 'UI Icon Pack',
      image: '/images/icons/ui-icon-pack-cover.jpg',
      price: 4.99,
      description: '500 crisp UI icons in SVG + PNG.',
      fileUrl: '/downloads/ui-icon-pack.zip',
    },
    {
      id: 'minimal-icons',
      title: 'Minimal Icons',
      image: '/images/icons/minimal-icons-cover.jpg',
      price: 3.99,
      description: 'Clean, thin-line icons great for dashboards.',
      fileUrl: '/downloads/minimal-icons.zip',
    },
    {
      id: 'gradient-icons',
      title: 'Gradient Icons',
      image: '/images/icons/gradient-icons-cover.jpg',
      price: 5.49,
      description: 'Vibrant, modern gradient-styled icons.',
      fileUrl: '/downloads/gradient-icons.zip',
    },
    {
      id: 'outline-icons',
      title: 'Outline Icons',
      image: '/images/icons/outline-icons-cover.jpg',
      price: 4.49,
      description: 'Balanced outlines in multiple sizes.',
      fileUrl: '/downloads/outline-icons.zip',
    },
    {
      id: 'emoji-icons',
      title: 'Emoji Icons',
      image: '/images/icons/emoji-icons-cover.jpg',
      price: 3.49,
      description: 'Friendly emoji-style set for playful UIs.',
      fileUrl: '/downloads/emoji-icons.zip',
    },
    {
      id: 'social-icon-pack',
      title: 'Social Icon Pack',
      image: '/images/icons/social-icon-pack-cover.jpg',
      price: 3.99,
      description: 'All major platforms, filled & outline variants.',
      fileUrl: '/downloads/social-icon-pack.zip',
    },
  ];

  const structuredData = items.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: `https://digitalproductsartisan.com${p.image}`,
    description: p.description,
    sku: p.id,
    offers: {
      '@type': 'Offer',
      url: 'https://digitalproductsartisan.com/categories/icons',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Icons | Digital Products Artisan</title>
        <meta
          name="description"
          content="Downloadable icon packs in SVG/PNG — minimal, outline, gradient, social, and more."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🔘 Icons</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              {/* ✅ Hoverable, perfectly-fit cover (icon art is often square) */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="1/1"
                fit="contain"   // switch to "cover" if you prefer edge-to-edge fill
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                <button
                  className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  data-item-id={item.id}
                  data-item-name={item.title}
                  data-item-price={item.price}
                  data-item-url="/categories/icons"
                  data-item-description={item.description}
                  data-item-image={item.image}
                  data-item-file-guid={item.fileUrl}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
