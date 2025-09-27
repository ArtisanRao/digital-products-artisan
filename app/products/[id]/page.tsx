// app/products/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true; // allow ids not listed below
export const fetchCache = "force-no-store";
export const revalidate = 0;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  // Numeric fast-path
  if (/^\d+$/.test(raw)) {
    const idNum = Number(raw);
    const byMap = (productsById as any)?.[idNum];
    if (byMap) return byMap;
    const byLinear = products.find((p) => Number(p.id) === idNum);
    if (byLinear) return byLinear;
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
function rawGallery(p: any): string[] {
  const explicit = Array.isArray(p?.images) ? (p.images as string[]) : [];
  if (explicit.length) return Array.from(new Set(explicit.filter(Boolean)));
  const discovered = discoverGallery(p?.slug);
  if (discovered.length) return discovered;
  return [p?.image].filter(Boolean) as string[];
}

/** Clamp to exactly cover + up to 3 unique extras */
function coverPlusThree(imgs: string[]): string[] {
  const list = imgs.filter(Boolean);
  const cover = list[0] ?? "/images/placeholder.jpg";
  const extras = list.slice(1).filter((s) => s !== cover);
  return [cover, ...extras.slice(0, 3)];
}

/* ------------------- static params (optional) ------------------- */

export function generateStaticParams() {
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

  const gallery = coverPlusThree(rawGallery(product));
  const ogImage = gallery[0]?.startsWith("http")
    ? gallery[0]
    : `https://digitalproductsartisan.com${gallery[0]}`;

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

  // Accept **either** numeric id or slug and render directly.
  const product = findProduct(id);
  if (!product) notFound();

  const galleryImages = coverPlusThree(rawGallery(product));

  const priceNum =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const originalNum =
    typeof (product as any).originalPrice === "number"
      ? (product as any).originalPrice
      : Number((product as any).originalPrice) || 0;

  const canonicalHandle = String(product.slug ?? product.id);
  const canonicalHref = `/products/${encodeURIComponent(canonicalHandle)}`;

  const POLICY_COUNTRIES = [
    "US","CA","GB","DE","FR","ES","IT","NL","SE","NO","FI","DK","IE","PT","PL","AT","BE","CH","AU","NZ",
  ];
  const today = new Date();
  const priceValidFrom = today.toISOString().slice(0, 10);
  const priceValidUntil = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);

  const productLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: `https://digitalproductsartisan.com${canonicalHref}`,
    image: galleryImages.map((src) =>
      src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`
    ),
    description: product.description,
    sku: String(product.id),
    brand: { "@type": "Brand", name: "Digital Products Artisan" },
    offers: {
      "@type": "Offer",
      url: `https://digitalproductsartisan.com${canonicalHref}`,
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
      shippingDetails: [{ "@type": "OfferShippingDetails", doesNotShip: true }],
    },
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
        {/* Gallery (cover + up to 3 extras) */}
        <div className="w-full rounded-2xl border bg-white p-3 hover-zoom">
          <ProductGallery images={galleryImages} alt={product.title} />
        </div>

        {/* Details */}
        <section>
          <h1 className="text-4xl font-extrabold leading-tight">
            <Link
              href={canonicalHref}
              prefetch={false}
              className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            >
              {product.title}
            </Link>
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold">€{priceNum.toFixed(2)}</span>
            {originalNum > priceNum && (
              <span className="text-gray-400 line-through">€{originalNum.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-4 text-[15px] leading-relaxed text-gray-700">
            <p className="whitespace-pre-line">
              {teaser}
              {needsToggle && "…"}
            </p>
            {needsToggle && (
              <details className="group mt-1">
                <summary className="inline cursor-pointer select-none text-blue-700 hover:underline">
                  <span className="group-open:hidden">More</span>
                  <span className="hidden group-open:inline">Less</span>
                </summary>
                <div className="mt-2 whitespace-pre-line">{remainder}</div>
              </details>
            )}
          </div>

          {/* Compact, consistent CTAs */}
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
    </main>
  );
}
