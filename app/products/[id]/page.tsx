// app/products/[id]/page.tsx
export const runtime = "nodejs";
export const dynamicParams = true; // allow IDs not listed in generateStaticParams
export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import path from "node:path";
import fs from "node:fs";
import { products, productsById } from "@/data/products";
import AddToCartButton from "@/components/shop/AddToCartButton";
import BuyNowButton from "@/components/buy-now-button";
import ProductGallery from "@/components/ProductGallery";

/* ------------------------ helpers ------------------------ */

const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

function firstExistingPublicHref(hrefs: string[]): string | undefined {
  for (const href of hrefs) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return href;
  }
  return undefined;
}

/** Accepts numeric id *or* slug and returns a product */
function findProduct(idOrSlug: string) {
  const raw = String(idOrSlug ?? "").trim();
  if (!raw) return null;

  // Numeric ID (fast path)
  if (/^\d+$/.test(raw)) {
    const idNum = Number(raw);
    const byId = (productsById as any)?.[idNum];
    if (byId) return byId;
    const byIdLinear = products.find((p) => Number(p.id) === idNum);
    if (byIdLinear) return byIdLinear;
  }

  // Slug (case-insensitive) or string id fallback
  const handle = raw.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === handle) ||
    products.find((p) => String(p.id) === raw) ||
    null
  );
}

/** Discover gallery under /public/images/products/<slug> if needed */
function discoverGallery(slug?: string): string[] {
  if (!slug) return [];
  const dir = pub("images", "products", slug);
  if (!fs.existsSync(dir)) return [];
  const all = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

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

/** Prefer product.images; else discover; else single product.image */
function buildGallery(p: any): string[] {
  const explicit = Array.isArray(p?.images) ? (p.images as string[]) : [];
  if (explicit.length) return Array.from(new Set(explicit.filter(Boolean)));
  const discovered = discoverGallery(p?.slug);
  if (discovered.length) return discovered;
  return [p?.image].filter(Boolean) as string[];
}

/* ------------------- static params (optional) ------------------- */

export function generateStaticParams() {
  // Only numeric IDs to avoid conflicts with slug paths
  return products
    .filter((p) => p.id !== undefined && /^\d+$/.test(String(p.id)))
    .map((p) => ({ id: String(p.id) }));
}

/* ------------------------- metadata ------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) return {};

  const canonicalHandle = String(product.slug ?? product.id);
  const canonical = `/products/${encodeURIComponent(canonicalHandle)}`;
  const gallery = buildGallery(product);
  const ogImage =
    gallery[0]?.startsWith("http")
      ? gallery[0]
      : `https://digitalproductsartisan.com${gallery[0] ?? "/images/placeholder.jpg"}`;

  return {
    metadataBase: new URL("https://digitalproductsartisan.com"),
    title: `${product.title} | Digital Products Artisan`,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `https://digitalproductsartisan.com${canonical}`,
      title: `${product.title} | Digital Products Artisan`,
      description: product.description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Digital Products Artisan`,
      description: product.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

/* --------------------------- page --------------------------- */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Accept either numeric ID or slug here
  const product = findProduct(id);
  if (!product) notFound();

  // If the segment looks like a slug (not all digits) and we *have* a slug,
  // redirect to the canonical /products/[slug] page to avoid dupes & any
  // chance of the wrong matcher capturing it.
  if (!/^\d+$/.test(id) && product.slug) {
    redirect(`/products/${encodeURIComponent(String(product.slug))}`);
  }

  const galleryImages = buildGallery(product);
  const priceNum =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const originalNum =
    typeof (product as any).originalPrice === "number"
      ? (product as any).originalPrice
      : Number((product as any).originalPrice) || 0;

  const canonicalHandle = String(product.slug ?? product.id);
  const canonicalAbs = `https://digitalproductsartisan.com/products/${encodeURIComponent(
    canonicalHandle
  )}`;

  const POLICY_COUNTRIES = [
    "US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "SE", "NO", "FI", "DK", "IE",
    "PT", "PL", "AT", "BE", "CH", "AU", "NZ",
  ];
  const today = new Date();
  const priceValidFrom = today.toISOString().slice(0, 10);
  const until = new Date(today);
  until.setFullYear(until.getFullYear() + 1);
  const priceValidUntil = until.toISOString().slice(0, 10);

  const productLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: canonicalAbs,
    image: galleryImages.map((src) =>
      src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`
    ),
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

  const canonicalHref = `/products/${encodeURIComponent(canonicalHandle)}`;

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
        {/* Gallery */}
        <div className="w-full rounded-2xl border bg-white p-3 hover-zoom">
          <ProductGallery images={galleryImages} alt={product.title} />
        </div>

        {/* Details */}
        <section>
          <h1 className="text-3xl font-bold">
            <Link
              href={canonicalHref}
              prefetch={false}
              className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            >
              {product.title}
            </Link>
          </h1>

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

          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <AddToCartButton
              id={product.id}
              slug={product.slug as string | undefined}
              title={product.title}
              price={product.price}
              image={galleryImages[0]}
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
    </main>
  );
}
