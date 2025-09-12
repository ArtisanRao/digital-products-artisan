// app/products/best-sellers/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalproductsartisan.com'),
  title: 'Best-Selling Digital Products | Digital Products Artisan',
  description:
    'Shop our best-selling ebooks, templates, and productivity tools from Digital Products Artisan.',
  alternates: { canonical: '/products/best-sellers' },
  openGraph: {
    title: 'Best-Selling Digital Products | Digital Products Artisan',
    url: 'https://digitalproductsartisan.com/products/best-sellers',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const CANONICAL_URL = 'https://digitalproductsartisan.com/products/best-sellers';

export default function BestSellersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Best-Selling Digital Products',
    url: CANONICAL_URL,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: `${CANONICAL_URL}#chatgpt-business`,
          item: {
            '@type': 'Product',
            name: 'Mastering ChatGPT for Business',
            image: 'https://digitalproductsartisan.com/products/chatgpt-guide.jpg',
            description: 'A detailed PDF guide to unlock AI productivity.',
            offers: {
              '@type': 'Offer',
              price: '9.99',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: `${CANONICAL_URL}#canva-pack`,
          item: {
            '@type': 'Product',
            name: 'Canva Templates Mega Pack',
            image: 'https://digitalproductsartisan.com/products/canva-pack.jpg',
            description: '100+ drag-and-drop templates for social media.',
            offers: {
              '@type': 'Offer',
              price: '14.99',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          url: `${CANONICAL_URL}#excel-tracker`,
          item: {
            '@type': 'Product',
            name: 'Excel Tracker Pro',
            image: 'https://digitalproductsartisan.com/products/excel-tracker.jpg',
            description:
              'Track expenses, projects, and habits with an all-in-one spreadsheet.',
            offers: {
              '@type': 'Offer',
              price: '7.99',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
    },
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        🔥 Best-Selling Digital Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product 1 */}
        <div id="chatgpt-business" className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/chatgpt-guide.jpg"
            alt="Mastering ChatGPT for Business ebook cover"
            className="rounded mb-4"
            loading="lazy"
          />
          <h2 className="text-xl font-semibold mb-1">
            Mastering ChatGPT for Business
          </h2>
          <p className="text-gray-600 mb-2">
            A detailed PDF guide to unlock AI productivity.
          </p>
          <p className="text-lg font-bold mb-3">€9.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="chatgpt-business"
            data-item-name="Mastering ChatGPT for Business"
            data-item-price="9.99"
            data-item-url={CANONICAL_URL}
            data-item-description="PDF guide to using ChatGPT effectively"
            data-item-image="/products/chatgpt-guide.jpg"
            data-item-file-guid="your-download-url-1"
          >
            Add to Cart
          </button>
        </div>

        {/* Product 2 */}
        <div id="canva-pack" className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/canva-pack.jpg"
            alt="Canva Templates Mega Pack preview"
            className="rounded mb-4"
            loading="lazy"
          />
          <h2 className="text-xl font-semibold mb-1">
            Canva Templates Mega Pack
          </h2>
          <p className="text-gray-600 mb-2">
            100+ drag-and-drop templates for social media.
          </p>
          <p className="text-lg font-bold mb-3">€14.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="canva-pack"
            data-item-name="Canva Templates Mega Pack"
            data-item-price="14.99"
            data-item-url={CANONICAL_URL}
            data-item-description="Social media Canva templates"
            data-item-image="/products/canva-pack.jpg"
            data-item-file-guid="your-download-url-2"
          >
            Add to Cart
          </button>
        </div>

        {/* Product 3 */}
        <div id="excel-tracker" className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/excel-tracker.jpg"
            alt="Excel Tracker Pro spreadsheet layouts"
            className="rounded mb-4"
            loading="lazy"
          />
          <h2 className="text-xl font-semibold mb-1">Excel Tracker Pro</h2>
          <p className="text-gray-600 mb-2">
            Track expenses, projects, and habits like a pro.
          </p>
          <p className="text-lg font-bold mb-3">€7.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="excel-tracker"
            data-item-name="Excel Tracker Pro"
            data-item-price="7.99"
            data-item-url={CANONICAL_URL}
            data-item-description="All-in-one Excel productivity tracker"
            data-item-image="/products/excel-tracker.jpg"
            data-item-file-guid="your-download-url-3"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* SEO: JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
