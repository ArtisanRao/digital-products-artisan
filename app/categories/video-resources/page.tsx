'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function VideoResourcesPage() {
  const items = [
    {
      id: 'b-roll-pack-urban',
      title: 'B-Roll Pack: Urban',
      image: '/images/video-resources/b-roll-pack-urban-cover.jpg',
      price: 7.99,
      description: 'Cinematic city b-roll clips in 4K, ProRes + H.264.',
      fileUrl: '/downloads/b-roll-pack-urban.zip',
    },
    {
      id: 'transitions-pack-smooth',
      title: 'Transitions Pack: Smooth',
      image: '/images/video-resources/transitions-pack-smooth-cover.jpg',
      price: 5.49,
      description: 'Drag-and-drop seamless transitions for Premiere/Final Cut.',
      fileUrl: '/downloads/transitions-pack-smooth.zip',
    },
    {
      id: 'title-templates-modern',
      title: 'Title Templates: Modern',
      image: '/images/video-resources/title-templates-modern-cover.jpg',
      price: 4.99,
      description: 'Clean lower-thirds and animated titles (MOGRT + .prfpset).',
      fileUrl: '/downloads/title-templates-modern.zip',
    },
    {
      id: 'light-leaks-pack',
      title: 'Light Leaks Pack',
      image: '/images/video-resources/light-leaks-pack-cover.jpg',
      price: 6.49,
      description: 'Organic light leaks overlays in 4K, PNG sequences included.',
      fileUrl: '/downloads/light-leaks-pack.zip',
    },
    {
      id: 'lut-pack-cinematic',
      title: 'Cinematic LUT Pack',
      image: '/images/video-resources/lut-pack-cinematic-cover.jpg',
      price: 3.99,
      description: '.cube LUTs for Sony/Canon/Blackmagic, teal-orange & film looks.',
      fileUrl: '/downloads/lut-pack-cinematic.zip',
    },
    {
      id: 'sound-fx-essentials',
      title: 'Sound FX Essentials',
      image: '/images/video-resources/sound-fx-essentials-cover.jpg',
      price: 4.49,
      description: 'Whooshes, hits, risers, swooshes — WAV 48kHz.',
      fileUrl: '/downloads/sound-fx-essentials.zip',
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
      url: 'https://digitalproductsartisan.com/categories/video-resources',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Video Resources | Digital Products Artisan</title>
        <meta
          name="description"
          content="B-roll, transitions, titles, light leaks, LUTs, and sound effects for editors and creators."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🎥 Video Resources</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover (16:9 suits video assets) */}
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
                  data-item-url="/categories/video-resources"
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
