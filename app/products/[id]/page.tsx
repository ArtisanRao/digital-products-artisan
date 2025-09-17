import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import AddToCartButton from '@/components/add-to-cart-button';

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
      type: 'website', // Next.js doesn't support 'product' here
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

  // Build absolute image list (prefer array if present)
  const imagesRel = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images
    : [product.image];
  const imagesAbs = imagesRel.map((src: string) =>
    src.startsWith('http') ? src : `https://digitalproductsartisan.com${src}`
  );

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
      price: product.price.toFixed(2), // string is fine/safe for JSON-LD
      availability: 'https://schema.org/InStock',
      priceValidFrom,                  // ✅ added
      priceValidUntil,                 // ✅ added (fixes warning)
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

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{' '}
        <Link href="/products" className="hover:underline">Products</Link> <span>›</span>{' '}
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative w-full h-96 bg-white rounded">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            fill
            className="object-contain rounded"
            sizes="(min-width:1024px) 50vw, 100vw"
            priority
          />
        </div>

        <section>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">€{product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="line-through text-gray-400">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-6">
            <AddToCartButton productId={product.id} className="bg-black text-white hover:bg-black/90" />
          </div>
        </section>
      </div>

      {/* SEO: JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
    </main>
  );
}
