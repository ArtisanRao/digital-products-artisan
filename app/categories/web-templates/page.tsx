'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function WebTemplatesPage() {
  const items = [
    {
      id: 'portfolio-site-template',
      title: 'Portfolio Site Template',
      image: '/images/web-templates/portfolio-site-template-cover.jpg',
      price: 9.99,
      description: 'Clean portfolio with projects, case studies, and blog.',
      fileUrl: '/downloads/portfolio-site-template.zip',
    },
    {
      id: 'saas-landing-template',
      title: 'SaaS Landing Template',
      image: '/images/web-templates/saas-landing-template-cover.jpg',
      price: 11.49,
      description: 'Conversion-focused landing with pricing, FAQs, and CTA sections.',
      fileUrl: '/downloads/saas-landing-template.zip',
    },
    {
      id: 'startup-multipage-template',
      title: 'Startup Multipage Template',
      image: '/images/web-templates/startup-multipage-template-cover.jpg',
      price: 12.99,
      description: 'About, Careers, Blog, and Product pages with responsive layout.',
      fileUrl: '/downloads/startup-multipage-template.zip',
    },
    {
      id: 'blog-theme-minimal',
      title: 'Blog Theme (Minimal)',
      image: '/images/web-templates/blog-theme-minimal-cover.jpg',
      price: 7.99,
      description: 'Minimal, typography-first blog theme with dark mode.',
      fileUrl: '/downloads/blog-theme-minimal.zip',
    },
    {
      id: 'agency-onepage-template',
      title: 'Agency One-Page Template',
      image: '/images/web-templates/agency-onepage-template-cover.jpg',
      price: 8.49,
      description: 'Hero, services, work, testimonials, and contact sections.',
      fileUrl: '/downloads/agency-onepage-template.zip',
    },
    {
      id: 'shop-ui-kit',
      title: 'Shop UI Kit',
      image: '/images/web-templates/shop-ui-kit-cover.jpg',
      price: 10.49,
      description: 'Reusable components: cards, product grids, filters, modals.',
      fileUrl: '/downloads/shop-ui-kit.zip',
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
      url: 'https://digitalproductsartisan.com/categories/web-templates',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Web Templates | Digital Products Artisan</title>
        <meta
          name="description"
          content="Responsive website templates and UI kits — portfolio, SaaS, startup, blog, agency and more."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🌐 Web Templates</h1>

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
                ratio="16/9"     // change to "3/2" or "1/1" if your covers differ
                fit="contain"     // switch to "cover" for edge-to-edge fill
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
                  data-item-url="/categories/web-templates"
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
