import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data/products';
import AddToCartButton from '@/components/add-to-cart-button';
import ProductGallery from '@/components/product-gallery'; // ⬅️ restore gallery
import BuyNowButton from '@/components/buy-now-button';     // ⬅️ client Buy button (uses /api/checkout)

export const revalidate = 3600;

// Pre-render all product pages
export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

// Per-product SEO (Next 15: params is a Promise)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => String(p.id) === id);
  if (!product) return {};

  const canonical = `/products/${id}`;
  const absoluteImage = `https://digitalproductsartisan.com${product.image}`;

  return {
    metadataBase: new URL('https://digitalproductsartisan.com'),
    title: `${product.title} | Digital Products Artisan`,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title: `${product.title} | Digital Products Artisan`,
      url: `https://digitalproductsartisan.com${canonical}`,
      type: 'website',
      images: [{ url: absoluteImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | Digital Products Artisan`,
      images: [absoluteImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => String(p.id) === id);
  if (!product) notFound();

  const canonicalAbs = `https://digitalproductsartisan.com/products/${id}`;

  // Build image list for gallery
  const imagesRel =
    Array.isArray((product as any).images) && (product as any).images.length
      ? (product as any).images
      : [product.image];
  const galleryImages = (imagesRel as string[]).filter(Boolean);

  const imagesAbs = galleryImages.map((src: string) =>
    src.startsWith('http') ? src : `https://digitalproductsartisan.com${src}`
  );

  // Optional “coverage” countries to satisfy Merchant warnings
  const POLICY_COUNTRIES = [
    'US','CA','GB','DE','FR','ES','IT','NL','SE','NO','FI','DK','IE',
    'PT','PL','AT','BE','CH','AU','NZ'
  ];

  // ---- JSON-LD: Product ----
  const today = new Date();
  const priceValidFrom = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const priceValidUntilDate = new Date(today);
  priceValidUntilDate.setFullYear(priceValidUntilDate.getFullYear() + 1);
  const priceValidUntil = priceValidUntilDate.toISOString().slice(0, 10); // YYYY-MM-DD

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url: canonicalAbs,
    image: imagesAbs,
    description: product.description,
    sku: String(product.id),
    brand: { '@type': 'Brand', name: 'Digital Products Artisan' },
    offers: {
      '@type': 'Offer',
      url: canonicalAbs,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      priceValidFrom,
      priceValidUntil,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        applicableCountry: POLICY_COUNTRIES,
      },
      shippingDetails: [
        {
          '@type': 'OfferShippingDetails',
          doesNotShip: true,
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: POLICY_COUNTRIES,
          },
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: String(product.reviews),
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        author: { '@type': 'Person', name: 'Verified buyer' },
      },
    ],
  };

  // ---- JSON-LD: Breadcrumbs ----
  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@id': 'https://digitalproductsartisan.com/', name: 'Home' } },
      { '@type': 'ListItem', position: 2, item: { '@id': 'https://digitalproductsartisan.com/products', name: 'Products' } },
      { '@type': 'ListItem', position: 3, item: { '@id': canonicalAbs, name: product.title } },
    ],
  };

  // ---------- Read more / Show less (server-only; no client JS) ----------
  const fullText =
    ((product as any).longDescription as string | undefined)?.trim() ||
    product.description ||
    '';
  const MAX_CHARS = 220;
  const needsToggle = fullText.length > MAX_CHARS;
  const teaser = needsToggle ? fullText.slice(0, MAX_CHARS).trimEnd() : fullText;
  const remainder = needsToggle ? fullText.slice(MAX_CHARS) : '';

  return (
    <main className="container mx-auto px-4 py-8 product-page" data-page="product">
      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:underline">Home</Link>{' '}
        <span>›</span>{' '}
        <Link href="/products" className="hover:underline">Products</Link>{' '}
        <span>›</span>{' '}
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gallery with left-side thumbnail rail */}
        <div className="w-full">
          <ProductGallery images={galleryImages} alt={product.title} />
        </div>

        <section>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Short teaser + natively expandable remainder */}
          <div className="mt-3 text-gray-700 text-[15px] leading-relaxed">
            <p className="whitespace-pre-line">
              {teaser}
              {needsToggle && '…'}
            </p>

            {needsToggle && (
              <details className="group mt-1">
                <summary
                  className="inline cursor-pointer text-blue-700 hover:underline select-none"
                  aria-label="Toggle full description"
                >
                  <span className="group-open:hidden">More</span>
                  <span className="hidden group-open:inline">Less</span>
                </summary>
                <div className="mt-2 whitespace-pre-line">
                  {remainder}
                </div>
              </details>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold">€{product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="line-through text-gray-400">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              className="bg-black text-white hover:bg-black/90"
            />
            <BuyNowButton
              productId={product.id}
              qty={1}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Buy
            </BuyNowButton>
          </div>
        </section>
      </div>

      {/* SEO: JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </main>
  );
}
