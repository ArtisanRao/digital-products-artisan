// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

const UI_VERSION = "product-hardened-v6";

/* ---------------- helpers ---------------- */
function toSlug(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function isNumeric(x: string) {
  return /^[0-9]+$/.test(String(x || ""));
}
function byParam(param: string) {
  const needle = String(param || "").trim();
  if (!needle) return null;

  if (isNumeric(needle)) {
    const n = Number(needle);
    const hit = products.find((p: any) => Number(p?.id) === n);
    if (hit) return hit;
  }
  const bySlug =
    products.find(
      (p: any) => String(p?.slug || "").toLowerCase() === needle.toLowerCase()
    ) ?? null;
  if (bySlug) return bySlug;

  const byTitle = products.find((p: any) => toSlug(p?.title) === needle) ?? null;
  return byTitle;
}
function canonicalSlug(p: any) {
  return String(p?.slug || toSlug(p?.title || "product"));
}
function canonicalHref(p: any) {
  return `/products/${encodeURIComponent(canonicalSlug(p))}`;
}
function productImages(p: any): string[] {
  const arr = Array.isArray(p?.images) ? p.images.filter(Boolean) : [];
  const cover = (arr[0] ?? p?.image ?? "/images/placeholder.jpg") as string;
  const extras = arr.slice(1).filter(Boolean);
  const unique = Array.from(new Set([cover, ...extras])).slice(0, 12);
  return unique.map((src) =>
    src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`
  );
}
/** Strip to plain JSON-ish values only */
function sanitizeProduct(raw: any) {
  const safe: any = {};
  if (!raw || typeof raw !== "object") return safe;
  safe.id = typeof raw.id === "number" || typeof raw.id === "string" ? raw.id : undefined;
  safe.slug = typeof raw.slug === "string" ? raw.slug : undefined;
  safe.title = typeof raw.title === "string" ? raw.title : "Product";
  safe.category = typeof raw.category === "string" ? raw.category : "";
  safe.price =
    typeof raw.price === "number" || typeof raw.price === "string" ? raw.price : "";
  safe.images = Array.isArray(raw.images)
    ? raw.images.filter((x: any) => typeof x === "string" && x.trim())
    : [];
  safe.image = typeof raw.image === "string" ? raw.image : undefined;
  safe.description = typeof raw.description === "string" ? raw.description : "";
  return safe;
}

/* --------- metadata --------- */
export async function generateMetadata({ params }: any) {
  const resolved = params?.then ? await params : params;
  const slug = String(resolved?.slug || "");
  const pretty =
    slug
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase()) || "Product";

  const title = `${pretty} | Digital Products Artisan`;
  const description = "Explore premium digital downloads.";
  const canonical = `https://digitalproductsartisan.com/products/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "product", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({ params }: any) {
  const resolved = params?.then ? await params : params;
  const slug = String(resolved?.slug || "");

  const raw = byParam(slug);
  if (!raw) notFound();

  const p = sanitizeProduct(raw);
  const title = p.title || "Product";
  const category = p.category || "";
  const priceText =
    typeof p.price === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.price)
      : typeof p.price === "string"
      ? p.price
      : "";
  const imgs = productImages(p);
  const mainImg = imgs[0] ?? "/images/placeholder.jpg";
  const canonical = canonicalHref(p);

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100] clickable-surface"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      <style>{`
        [data-ui^="ProductPage@"] a,
        [data-ui^="ProductPage@"] button,
        [data-ui^="ProductPage@"] [role="button"] {
          pointer-events:auto !important; position:relative; z-index:20;
        }
        .hero-overlay,.gradient-overlay,.noise-overlay,.overlay,[data-overlay],[data-decorative="true"],
        [class*="overlay-"],[class$="-overlay"],.fixed-overlay,.absolute-overlay,[data-blocking-overlay="true"] {
          pointer-events:none !important; z-index:-1 !important;
        }
      `}</style>

      <link rel="canonical" href={canonical} />

      {/* Title + subtitle with hover underline and CTA row */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight inline-block">
          <Link
            href={canonical}
            prefetch={false}
            className="group relative inline-block"
            title={title}
          >
            <span className="border-b border-transparent group-hover:border-current transition-[border-color] duration-200">
              {title}
            </span>
          </Link>
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-700">
          {priceText && <div className="text-2xl font-semibold">{priceText}</div>}
          {category && (
            <div className="text-sm">
              <span className="text-gray-500">in </span>
              <Link
                href={`/categories/${encodeURIComponent(toSlug(category))}`}
                prefetch={false}
                className="group inline-block"
              >
                <span className="border-b border-transparent group-hover:border-current transition-[border-color] duration-200">
                  {category}
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Buttons under the subtitle */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={mainImg}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            href={`/cart?add=${encodeURIComponent(canonicalSlug(p))}&qty=1`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Add to cart
          </Link>
          <Link
            href={`/api/checkout?product=${encodeURIComponent(canonicalSlug(p))}&qty=1`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Buy
          </Link>
        </div>
      </header>

      {/* Left-rail thumbs, main image, right card */}
      <section className="grid gap-6 md:grid-cols-[96px_1fr_380px]">
        {/* Left vertical thumbnails */}
        <div className="order-2 md:order-1 md:sticky md:top-20 h-max">
          <div className="grid auto-rows-max gap-2">
            {imgs.slice(0, 8).map((src, i) => (
              <Link
                key={src + i}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="block rounded-lg border bg-white p-1 hover:shadow-sm"
                title="Open image in a new tab"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-20 h-20 object-cover md:w-24 md:h-24"
                  loading={i < 6 ? "eager" : "lazy"}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Main image */}
        <div className="order-1 md:order-2">
          <div className="rounded-xl border bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImg}
              alt={title}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </div>
        </div>

        {/* Right purchase card */}
        <aside className="order-3 rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">Instant download. Lifetime access.</p>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={mainImg}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              View
            </Link>
            <Link
              href={`/cart?add=${encodeURIComponent(canonicalSlug(p))}&qty=1`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Add to cart
            </Link>
            <Link
              href={`/api/checkout?product=${encodeURIComponent(canonicalSlug(p))}&qty=1`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Buy
            </Link>
          </div>

          {category && (
            <p className="mt-4 text-xs text-gray-500">
              Category:{" "}
              <Link
                href={`/categories/${encodeURIComponent(toSlug(category))}`}
                className="underline"
                prefetch={false}
              >
                {category}
              </Link>
            </p>
          )}
        </aside>
      </section>

      <section className="mt-10 prose max-w-none">
        <h2>About this product</h2>
        <p>
          {typeof p.description === "string" && p.description.trim()
            ? p.description
            : "High-quality digital resource crafted for creators and entrepreneurs."}
        </p>
      </section>
    </main>
  );
}
