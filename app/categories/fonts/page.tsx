'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function FontsPage() {
  const items = [
    {
      id: 'modern-sans-serif',
      title: 'Modern Sans Serif',
      image: '/images/fonts/modern-sans-serif-cover.jpg',
      price: 6.99,
      description: 'Clean, versatile sans for UI and headings. OTF/TTF + Webfonts.',
      fileUrl: '/downloads/modern-sans-serif.zip',
    },
    {
      id: 'handwritten-brush',
      title: 'Handwritten Brush',
      image: '/images/fonts/handwritten-brush-cover.jpg',
      price: 5.49,
      description: 'Casual brush script with alternates & ligatures. OTF/TTF.',
      fileUrl: '/downloads/handwritten-brush.zip',
    },
    {
      id: 'serif-editorial',
      title: 'Serif Editorial',
      image: '/images/fonts/serif-editorial-cover.jpg',
      price: 7.99,
      description: 'Elegant high-contrast serif for magazines & posters.',
      fileUrl: '/downloads/serif-editorial.zip',
    },
    {
      id: 'rounded-grotesk',
      title: 'Rounded Grotesk',
      image: '/images/fonts/rounded-grotesk-cover.jpg',
      price: 6.49,
      description: 'Friendly rounded grotesk in multiple weights.',
      fileUrl: '/downloads/rounded-grotesk.zip',
    },
    {
      id: 'mono-tech',
      title: 'Mono Tech',
      image: '/images/fonts/mono-tech-cover.jpg',
      price: 4.99,
      description: 'Monospaced techno feel, great for code visuals.',
      fileUrl: '/downloads/mono-tech.zip',
    },
    {
      id: 'signature-script',
      title: 'Signature Script',
      image: '/images/fonts/signature-script-cover.jpg',
      price: 6.49,
      description: 'Luxury signature script with swashes & alternates.',
      fileUrl: '/downloads/signature-script.zip',
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
      url: 'https://digitalproductsartisan.com/categories/fonts',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Fonts | Digital Products Artisan</title>
        <meta
          name="description"
          content="High-quality downloadable fonts: sans, serif, script, mono, and display — includes desktop & webfont files."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🔤 Fonts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover (use ratio="1/1" if your font covers are square) */}
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
                  data-item-url="/categories/fonts"
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
