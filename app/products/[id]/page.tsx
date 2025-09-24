// app/products/[id]/page.tsx
export const runtime = "nodejs";
export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs";
import { products } from "@/data/products";
import AddToCartButton from "@/components/add-to-cart-button";
import BuyNowButton from "@/components/buy-now-button";
import ProductGallery from "@/components/ProductGallery";

/** Resolve files under /public */
const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

/** If file exists under /public, return its public href */
function firstExistingPublicHref(hrefs: string[]): string | undefined {
  for (const href of hrefs) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return href;
  }
  return undefined;
}

/** Discover gallery from /public/images/products/<slug> when product.images is absent */
function discoverGallery(slug?: string): string[] {
  if (!slug) return [];
  const dir = pub("images", "products", slug);
  if (!fs.existsSync(dir)) return [];
  const all = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Prefer explicit cover, then other images (thumb/mock/preview first)
  const cover = firstExistingPublicHref([
    `/images/products/${slug}/cover.jpg`,
    `/images/products/${slug}/cover.png`,
    `/images/products/${slug}/cover.webp`,
  ]);

  const mocks = all
    .filter((f) => /^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f))
    .map((f) => `/images/products/${slug}/${f}`);

  const rest = all
    .filter(
      (f) =>
        f !== path.basename(cover ?? "") &&
        !(/^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f))
    )
    .map((f) => `/images/products/${slug}/${f}`);

  const list: string[] = [];
  if (cover) list.push(cover);
  list.push(...mocks, ...rest);
  return Array.from(new Set(list));
}

// Pre-render all product pages by numeric id
export function generateStaticParams() {
  return products
    .filter((p) => p.id !== undefined && p.id !== null)
    .map((p) => ({ id: String(p.id) }));
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
  const abs = (src: string) =>
    src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`;

  // Prefer product.images; else discover; else product.image
  const discovered = discoverGallery((product as any).slug);
  const gallery =
    Array.isArray((product as any).images) && (product as any).images.length
      ? ((product as any).images as string[])
      : discovered.length
      ? discovered
      : [product.image].filter(Boolean);

  const ogImage = abs(gallery[0] ?? "/images/placeholder.jpg");

  return {
    metadataBase: new URL("https://digitalproductsartisan.com"),
    title: `${product.title} | Digital Products Artisan`,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title: `${product.title} | Digital Products Artisan`,
      url: `https://digitalproductsartisan.com${canonical}`,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Digital Products Artisan`,
      images: [ogImage],
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
  const slug = (product as any).slug as string | undefined;

  // Build gallery (same logic as metadata)
  const discovered = discoverGallery(slug);
  const galleryImages: string[] =
    Array.isArray((product as any).images) && (product as any).images.length
      ? ((product as any).images as string[])
      : discovered.length
      ? discovered
      : [product.image].filter(Boolean);

  // Absolute URLs for JSON-LD
  const abs = (src: string) =>
    src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`;
  const imagesAbs = galleryImages.map(abs);

  // Pricing helpers (guard undefined)
  const priceNum =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const originalNum =
    typeof (product as any).originalPrice === "number"
      ? (product as any).originalPrice
      : Number((product as any).originalPrice) || 0;

  /** Structured data */
  const POLICY_COUNTRIES = [
    "US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "SE", "NO", "FI", "DK", "IE",
    "PT", "PL", "AT", "BE", "CH", "AU", "NZ",
  ];
  const today = new Date();
  const priceValidFrom = today.toISOString().slice(0, 10);
  const priceValidUntilDate = new Date(today);
  priceValidUntilDate.setFullYear(priceValidUntilDate.getFullYear() + 1);
  const priceValidUntil = priceValidUntilDate.toISOString().slice(0, 10);

  const productLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: canonicalAbs,
    image: imagesAbs,
    description: product.description,
    sku: String(product.id),
    brand: { "@type": "Brand", name: "Digital Products Artisan" },
    offers: {
      "@type": "Offer",
      url: canonicalAbs,
      priceCurrency: "EUR",
      price: priceNum.toFixed(2),
      availability: "https://schema.org/InStock",
      priceValidFrom,
      priceValidUntil,
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        applicableCountry: POLICY_COUNTRIES,
      },
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          doesNotShip: true,
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: POLICY_COUNTRIES,
          },
        },
      ],
    },
  };

  if ((product as any).rating && (product as any).reviews) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number((product as any).rating).toFixed(1),
      reviewCount: String((product as any).reviews),
    };
  }

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@id": "https://digitalproductsartisan.com/", name: "Home" } },
      { "@type": "ListItem", position: 2, item: { "@id": "https://digitalproductsartisan.com/products", name: "Products" } },
      { "@type": "ListItem", position: 3, item: { "@id": canonicalAbs, name: product.title } },
    ],
  };

  const fullText =
    ((product as any).longDescription as string | undefined)?.trim() ||
    product.description ||
    "";
  const MAX_CHARS = 220;
  const needsToggle = fullText.length > MAX_CHARS;
  const teaser = needsToggle ? fullText.slice(0, MAX_CHARS).trimEnd() : fullText;
  const remainder = needsToggle ? fullText.slice(MAX_CHARS) : "";

  return (
    <main className="container mx-auto px-4 py-8 product-page" data-page="product">
      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:underline">Home</Link>{" "}
        <span>›</span>{" "}
        <Link href="/products" className="hover:underline">Products</Link>{" "}
        <span>›</span>{" "}
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery (hover zoom comes from your global CSS/utilities) */}
        <div className="w-full rounded-2xl border bg-white p-3 hover-zoom">
          <ProductGallery images={galleryImages} alt={product.title} />
        </div>

        {/* Details */}
        <section>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="mt-3 text-[15px] leading-relaxed text-gray-700">
            <p className="whitespace-pre-line">
              {teaser}
              {needsToggle && "…"}
            </p>

            {needsToggle && (
              <details className="group mt-1">
                <summary
                  className="inline cursor-pointer select-none text-blue-700 hover:underline"
                  aria-label="Toggle full description"
                >
                  <span className="group-open:hidden">More</span>
                  <span className="hidden group-open:inline">Less</span>
                </summary>
                <div className="mt-2 whitespace-pre-line">{remainder}</div>
              </details>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold">€{priceNum.toFixed(2)}</span>
            {originalNum > priceNum && (
              <span className="text-gray-400 line-through">€{originalNum.toFixed(2)}</span>
            )}
          </div>

          {/* Actions (blue buttons; Add updates badge, Buy → checkout) */}
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <BuyNowButton
              productId={product.id}
              qty={1}
              className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Buy
            </BuyNowButton>
          </div>
        </section>
      </div>

      {/* JSON-LD */}
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
