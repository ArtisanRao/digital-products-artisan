\'use client\';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function TemplatesPage() {
  const items = [
    {
      id: 'ultimate-resume-template',
      title: 'Ultimate Resume Template',
      image: '/images/templates/ultimate-resume-template-cover.jpg',
      price: 6.99,
      description: 'Polished, ATS-friendly resume template with matching cover letter.',
      fileUrl: '/downloads/ultimate-resume-template.zip',
    },
    {
      id: 'invoice-template-kit',
      title: 'Invoice Template Kit',
      image: '/images/templates/invoice-template-kit-cover.jpg',
      price: 5.49,
      description: 'Clean, professional invoice templates (PDF/Docx).',
      fileUrl: '/downloads/invoice-template-kit.zip',
    },
    {
      id: 'business-proposal-template',
      title: 'Business Proposal Template',
      image: '/images/templates/business-proposal-template-cover.jpg',
      price: 7.99,
      description: 'Close deals faster with a ready-to-edit proposal deck.',
      fileUrl: '/downloads/business-proposal-template.zip',
    },
    {
      id: 'brand-guidelines-template',
      title: 'Brand Guidelines Template',
      image: '/images/templates/brand-guidelines-template-cover.jpg',
      price: 8.49,
      description: 'A complete style guide template for brand consistency.',
      fileUrl: '/downloads/brand-guidelines-template.zip',
    },
    {
      id: 'presentation-deck-template',
      title: 'Presentation Deck Template',
      image: '/images/templates/presentation-deck-template-cover.jpg',
      price: 6.49,
      description: 'Modern slide layouts for pitches, updates, and more.',
      fileUrl: '/downloads/presentation-deck-template.zip',
    },
    {
      id: 'content-calendar-template',
      title: 'Content Calendar Template',
      image: '/images/templates/content-calendar-template-cover.jpg',
      price: 4.99,
      description: 'Plan, schedule, and track your posts in one place.',
      fileUrl: '/downloads/content-calendar-template.zip',
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
      url: 'https://digitalproductsartisan.com/categories/templates',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Templates | Digital Products Artisan</title>
        <meta
          name="description"
          content="Ready-to-use templates for resumes, invoices, proposals, presentations, and more."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🧾 Templates</h1>

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
                ratio="16/9"      // or "3/2"
                fit="contain"      // use "cover" for edge-to-edge
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
                  data-item-url="/categories/templates"
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