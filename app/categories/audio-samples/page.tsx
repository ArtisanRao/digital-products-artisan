'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function AudioSamplesPage() {
  const items = [
    {
      id: 'drum-loops-essentials',
      title: 'Drum Loops Essentials',
      image: '/images/audio-samples/drum-loops-essentials-cover.jpg',
      price: 5.99,
      description: '100 royalty-free drum loops (90–140 BPM), WAV 24-bit.',
      fileUrl: '/downloads/drum-loops-essentials.zip',
    },
    {
      id: 'cinematic-ambience-pack',
      title: 'Cinematic Ambience Pack',
      image: '/images/audio-samples/cinematic-ambience-pack-cover.jpg',
      price: 6.49,
      description: 'Atmospheres, drones, pads — perfect for scoring.',
      fileUrl: '/downloads/cinematic-ambience-pack.zip',
    },
    {
      id: 'lofi-chords-kit',
      title: 'Lo-Fi Chords Kit',
      image: '/images/audio-samples/lofi-chords-kit-cover.jpg',
      price: 4.99,
      description: 'Warm Rhodes chords & progressions, key-labeled.',
      fileUrl: '/downloads/lofi-chords-kit.zip',
    },
    {
      id: 'sfx-whooshes-hits',
      title: 'SFX: Whooshes & Hits',
      image: '/images/audio-samples/sfx-whooshes-hits-cover.jpg',
      price: 3.99,
      description: 'Trailer whooshes, impacts, risers — WAV 48kHz.',
      fileUrl: '/downloads/sfx-whooshes-hits.zip',
    },
    {
      id: 'vocal-chops-pack',
      title: 'Vocal Chops Pack',
      image: '/images/audio-samples/vocal-chops-pack-cover.jpg',
      price: 5.49,
      description: 'Airy vocal chops with wet/dry versions.',
      fileUrl: '/downloads/vocal-chops-pack.zip',
    },
    {
      id: 'basslines-808s-pack',
      title: 'Basslines & 808s Pack',
      image: '/images/audio-samples/basslines-808s-pack-cover.jpg',
      price: 4.49,
      description: 'Clean subs, gritty 808s, and melodic bass loops.',
      fileUrl: '/downloads/basslines-808s-pack.zip',
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
      url: 'https://digitalproductsartisan.com/categories/audio-samples',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Audio Samples | Digital Products Artisan</title>
        <meta
          name="description"
          content="Royalty-free drum loops, ambience, SFX, vocals, basslines and more — ready for your next track."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🎵 Audio Samples</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Many audio covers are square — use 1/1 ratio */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="1/1"
                fit="contain"   // use "cover" for edge-to-edge fill if your art bleeds
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
                  data-item-url="/categories/audio-samples"
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
