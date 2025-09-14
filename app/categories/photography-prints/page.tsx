'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function PhotographyPrintsPage() {
  const items = [
    {
      id: 'nordic-landscape-print',
      title: 'Nordic Landscape Print',
      image: '/images/photography-prints/nordic-landscape-print-cover.jpg',
      price: 8.99,
      description: 'Minimal, ice-blue fjords with soft morning light.',
      fileUrl: '/downloads/nordic-landscape-print.zip',
    },
    {
      id: 'urban-night-print',
      title: 'Urban Night Print',
      image: '/images/photography-prints/urban-night-print-cover.jpg',
      price: 7.49,
      description: 'Neon-lit city scene with moody reflections.',
      fileUrl: '/downloads/urban-night-print.zip',
    },
    {
      id: 'coastal-sunrise-print',
      title: 'Coastal Sunrise Print',
      image: '/images/photography-prints/coastal-sunrise-print-cover.jpg',
      price: 7.99,
      description: 'Warm sunrise tones over a calm shoreline.',
      fileUrl: '/downloads/coastal-sunrise-print.zip',
    },
    {
      id: 'moody-forest-print',
      title: 'Moody Forest Print',
      image: '/images/photography-prints/moody-forest-print-cover.jpg',
      price: 6.99,
      description: 'Foggy pines with cinematic depth and grain.',
      fileUrl: '/downloads/moody-forest-print.zip',
    },
    {
      id: 'desert-dunes-print',
      title: 'Desert Dunes Print',
      image: '/images/photography-prints/desert-dunes-print-cover.jpg',
      price: 7.25,
      description: 'Golden hour sand textures with long shadows.',
      fileUrl: '/downloads/desert-dunes-print.zip',
    },
    {
      id: 'aurora-borealis-print',
      title: 'Aurora Borealis Print',
      image: '/images/photography-prints/aurora-borealis-print-cover.jpg',
      price: 9.49,
      description: 'Dancing greens and purples across arctic skies.',
      fileUrl: '/downloads/aurora-borealis-print.zip',
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
      url: 'https://digitalproductsartisan.com/categories/photography-prints',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Photography Prints | Digital Products Artisan</title>
        <meta
          name="description"
          content="High-quality photography prints ready to download and display — landscapes, cityscapes, nature and more."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">📸 Photography Prints</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover (change fit='cover' for edge-to-edge) */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="16/9"
                fit="contain"
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
                  data-item-url="/categories/photography-prints"
                  data-item-description={item.description}
                  data-item-image={item.image}
                  data-item-file-guid={item.fileUrl}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
