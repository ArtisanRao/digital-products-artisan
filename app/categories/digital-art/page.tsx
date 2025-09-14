'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function DigitalArtPage() {
  const items = [
    {
      id: 'abstract-waves-pack',
      title: 'Abstract Waves Pack',
      image: '/images/digital-art/abstract-waves-pack-cover.jpg',
      price: 6.99,
      description: 'Vibrant abstract wave artworks in hi-res JPG + PNG.',
      fileUrl: '/downloads/abstract-waves-pack.zip',
    },
    {
      id: 'neon-city-collection',
      title: 'Neon City Collection',
      image: '/images/digital-art/neon-city-collection-cover.jpg',
      price: 7.49,
      description: 'Cyberpunk cityscapes, printable and wallpaper-ready.',
      fileUrl: '/downloads/neon-city-collection.zip',
    },
    {
      id: 'minimal-shapes-posters',
      title: 'Minimal Shapes Posters',
      image: '/images/digital-art/minimal-shapes-posters-cover.jpg',
      price: 5.99,
      description: 'Clean geometric posters for modern interiors.',
      fileUrl: '/downloads/minimal-shapes-posters.zip',
    },
    {
      id: 'cosmic-gradient-pack',
      title: 'Cosmic Gradient Pack',
      image: '/images/digital-art/cosmic-gradient-pack-cover.jpg',
      price: 4.99,
      description: 'Dreamy gradients for backgrounds and prints.',
      fileUrl: '/downloads/cosmic-gradient-pack.zip',
    },
    {
      id: 'botanical-ink-illustrations',
      title: 'Botanical Ink Illustrations',
      image: '/images/digital-art/botanical-ink-illustrations-cover.jpg',
      price: 6.49,
      description: 'Hand-inked flora set, scanned at 600dpi.',
      fileUrl: '/downloads/botanical-ink-illustrations.zip',
    },
    {
      id: 'retro-80s-art-pack',
      title: 'Retro 80s Art Pack',
      image: '/images/digital-art/retro-80s-art-pack-cover.jpg',
      price: 7.99,
      description: 'Synthwave vibes: grids, sunsets, and retro textures.',
      fileUrl: '/downloads/retro-80s-art-pack.zip',
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
      url: 'https://digitalproductsartisan.com/categories/digital-art',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Digital Art | Digital Products Artisan</title>
        <meta
          name="description"
          content="High-quality downloadable digital art packs — abstracts, gradients, posters, cityscapes, and more."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🎨 Digital Art</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="16/9"      // use "1/1" if your covers are square
                fit="contain"      // switch to "cover" for edge-to-edge fill
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
                  data-item-url="/categories/digital-art"
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
