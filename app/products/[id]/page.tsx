// app/products/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
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

/** Unwrap props.params whether Promise or plain object */
async function resolveParams(props: any): Promise<{ id?: string }> {
  const maybe = props?.params;
  if (maybe && typeof maybe.then === "function") return (await maybe) ?? {};
  return maybe ?? {};
}

/** Find by numeric id or by slug (case-insensitive) */
function findProduct(idOrSlug: string) {
  const raw = String(idOrSlug ?? "").trim();
  if (!raw) return null;

  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    return (productsById as any)?.[n] ?? products.find((p) => Number(p.id) === n) ?? null;
  }
  const handle = raw.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === handle) ??
    products.find((p) => String(p.id) === raw) ??
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
        !(/^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f)),
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

/** For OG/Twitter only: 1 cover + up to 3 extras */
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
export async function generateMetadata(props: any): Promise<Metadata> {
  const { id = "" } = await resolveParams(props);
  const product = findProduct(id);
  if (!product) return {};

  const handle = String(product.slug ?? product.id);
  const canonical = `/products/${encodeURIComponent(handle)}`;

  const galleryForMeta = coverPlusThree(rawGallery(product));
  const ogImage = galleryForMeta[0]?.startsWith("http")
    ? galleryForMeta[0]
    : `https://digitalproductsartisan.com${galleryForMeta[0]}`;

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
export default async function ProductPage(props: any) {
  const { id = "" } = await resolveParams(props);

  // Render directly for both ids and slugs
  const product = findProduct(id);
  if (!product) notFound();

  // FULL set; component shows cover + 4 extras, rest behind its own “More”
  const allImages = rawGallery(product);

  const priceNum =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const originalNum =
    typeof (product as any).originalPrice === "number"
      ? (product as any).originalPrice
      : Number((product as any).originalPrice) || 0;

  const handle = String(product.slug ?? product.id);
  const canonicalHref = `/products/${encodeURIComponent(handle)}`;

  const fullText =
    ((product as any).longDescription as string | undefined)?.trim() ||
    product.description ||
    "";

  // ↓ Always show the toggle; only reveal extra content if there IS extra.
  const MAX_CHARS = 140;
  const hasExtra = fullText.length > MAX_CHARS;
  const teaser = hasExtra ? fullText.slice(0, MAX_CHARS).trimEnd() : fullText;
  const remainder = hasExtra ? fullText.slice(MAX_CHARS) : "";

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
        {/* Gallery — left “More” only (inside component), no right-side links */}
        <div id="gallery" className="w-full rounded-2xl border bg-white p-3 hover-zoom">
          <ProductGallery images={allImages} alt={product.title} maxThumbs={4} />
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

          {/* Subtitle/description with always-visible “More/Less” toggle */}
          <div className="mt-4 text-[15px] leading-relaxed text-gray-700" id="description">
            <p className="whitespace-pre-line" id="description-teaser">
              {hasExtra ? `${teaser}…` : teaser}
            </p>

            <details className="group mt-2 [&_summary::-webkit-details-marker]:hidden">
              <summary
                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white cursor-pointer select-none hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-controls="description-more"
              >
                <span className="group-open:hidden">More</span>
                <span className="hidden group-open:inline">Less</span>
              </summary>

              {/* Only renders content when there is extra text */}
              {hasExtra && (
                <div id="description-more" className="mt-2 whitespace-pre-line">
                  {remainder}
                </div>
              )}
            </details>
          </div>

          {/* CTAs */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <AddToCartButton
              id={product.id}
              slug={product.slug as string | undefined}
              title={product.title}
              price={product.price}
              image={allImages[0]}
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

      {/* JSON-LD (full image set for rich results) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            url: `https://digitalproductsartisan.com${canonicalHref}`,
            image: allImages.map((src) =>
              src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`,
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
            },
          }),
        }}
      />
    </main>
  );
}
