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
    const hit = (products as any[]).find((p) => Number(p?.id) === n);
    if (hit) return hit;
  }
  const bySlug =
    (products as any[]).find(
      (p) => String(p?.slug || "").toLowerCase() === needle.toLowerCase()
    ) ?? null;
  if (bySlug) return bySlug;

  const byTitle =
    (products as any[]).find((p) => toSlug(p?.title) === needle) ?? null;
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
  const unique = Array.from(new Set([cover, ...extras])).slice(0, 8);
  return unique.map((src) =>
    src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`
  );
}
/** Strip to plain JSON-ish values only */
function sanitizeProduct(raw: any) {
  const safe: any = {};
  if (!raw || typeof raw !== "object") return safe;
  safe.id =
    typeof raw.id === "number" || typeof raw.id === "string" ? raw.id : undefined;
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

/* --------- metadata kept generic to avoid data-time throws --------- */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const pretty =
    String(slug || "")
      .split("/")
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase()) || "Product";

  const title = `${pretty} | Digital Products Artisan`;
  const description = "Explore premium digital downloads.";
  const canonical = `https://digitalproductsartisan.com/products/${encodeURIComponent(
    String(slug || "")
  )}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "product", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const raw = byParam(String(slug));
  if (!raw) notFound();

  const p = sanitizeProduct(raw);
  const title = p.title || "Product";
  const category = p.category || "";
  const price =
    typeof p.price === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(p.price)
      : typeof p.price === "string"
      ? p.price
      : "";
  const imgs = productImages(p);
  const canonical = canonicalHref(p);
  const firstImg = (imgs[0] ?? "/images/placeholder.jpg") as string;

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100] clickable-surface"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* Small underline animation helpers for title/subtitle */}
      <style>{`
        .hover-underline {
          position: relative;
        }
        .hover-underline::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .2s ease;
          opacity: .9;
        }
        .hover-underline:hover::after { transform: scaleX(1); }
      `}</style>

      <link rel="canonical" href={canonical} />

      {/* TOP GRID: gallery + details */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* GALLERY */}
        <div className="flex gap-3">
          {/* vertical thumbs left */}
          {imgs.length > 1 && (
            <div className="hidden sm:flex flex-col gap-2 w-24 shrink-0">
              {imgs.slice(0, 6).map((src, i) => (
                <a
                  key={src + i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border bg-white p-1 hover:shadow"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full h-20 object-cover rounded-md"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </a>
              ))}
            </div>
          )}

          {/* main image */}
          <div className="flex-1">
            <div className="rounded-xl border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={firstImg}
                alt={title}
                className="w-full h-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* DETAILS + CTAs (to the right) */}
        <aside className="rounded-xl border bg-white p-5 h-fit">
          <div className="space-y-2">
            <Link
              href={canonical}
              prefetch={false}
              className="text-2xl md:text-3xl font-bold hover-underline"
            >
              {title}
            </Link>

            <div className="text-gray-700">
              {`A curated digital product${
                category ? ` in ` : `.`
              }`}
              {category && (
                <>
                  <Link
                    href={`/categories/${encodeURIComponent(toSlug(category))}`}
                    prefetch={false}
                    className="underline-offset-4 hover-underline"
                  >
                    {category}
                  </Link>
                  .
                </>
              )}
            </div>

            {price && (
              <div className="pt-2 text-2xl font-semibold">{price}</div>
            )}
          </div>

          {/* CTA row under title/subtitle */}
          <div className="mt-5 flex flex-wrap gap-3">
            {/* View = open main image */}
            <a
              href={firstImg}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              View
            </a>

            {/* Add to cart — lightweight GET so it doesn't crash if API not present */}
            <Link
              href={`/cart?add=${encodeURIComponent(canonicalSlug(p))}`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Add to cart
            </Link>

            {/* Buy now through your existing checkout API */}
            <Link
              href={`/api/checkout?product=${encodeURIComponent(
                canonicalSlug(p)
              )}&qty=1`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Buy
            </Link>
          </div>
        </aside>
      </section>

      {/* DESCRIPTION */}
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
