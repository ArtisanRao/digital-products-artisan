'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function MarketingToolsPage() {
  const items = [
    {
      id: 'email-swipe-files',
      title: 'Email Swipe Files',
      image: '/images/marketing-tools/email-swipe-files-cover.jpg',
      price: 6.99,
      description: 'High-converting email templates for launches, promos, and nurture.',
      fileUrl: '/downloads/email-swipe-files.zip',
    },
    {
      id: 'lead-magnet-pack',
      title: 'Lead Magnet Pack',
      image: '/images/marketing-tools/lead-magnet-pack-cover.jpg',
      price: 5.49,
      description: 'Done-for-you checklists, cheat sheets, and guides to grow your list.',
      fileUrl: '/downloads/lead-magnet-pack.zip',
    },
    {
      id: 'ad-copy-prompts',
      title: 'Ad Copy Prompts',
      image: '/images/marketing-tools/ad-copy-prompts-cover.jpg',
      price: 4.99,
      description: 'Battle-tested AI prompts for Facebook, Instagram, and Google Ads.',
      fileUrl: '/downloads/ad-copy-prompts.pdf',
    },
    {
      id: 'landing-page-wireframes',
      title: 'Landing Page Wireframes',
      image: '/images/marketing-tools/landing-page-wireframes-cover.jpg',
      price: 7.99,
      description: 'Conversion-first wireframes for sales, lead gen, and webinars.',
      fileUrl: '/downloads/landing-page-wireframes.zip',
    },
    {
      id: 'content-ideas-vault',
      title: 'Content Ideas Vault',
      image: '/images/marketing-tools/content-ideas-vault-cover.jpg',
      price: 3.99,
      description: 'Hundreds of post ideas for reels, blogs, and newsletters.',
      fileUrl: '/downloads/content-ideas-vault.pdf',
    },
    {
      id: 'customer-persona-kit',
      title: 'Customer Persona Kit',
      image: '/images/marketing-tools/customer-persona-kit-cover.jpg',
      price: 6.49,
      description: 'Research template + interview prompts to nail your ICP.',
      fileUrl: '/downloads/customer-persona-kit.zip',
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
      url: 'https://digitalproductsartisan.com/categories/marketing-tools',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Marketing Tools | Digital Products Artisan</title>
        <meta
          name="description"
          content="Prompts, swipe files, lead magnets, wireframes, and more to grow faster."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">📥 Marketing Tools</h1>

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
                ratio="16/9"     // or "3/2" if you prefer taller frames
                fit="contain"     // use "cover" for edge-to-edge fill
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
                  data-item-url="/categories/marketing-tools"
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
