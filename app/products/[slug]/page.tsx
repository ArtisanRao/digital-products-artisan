// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
// Render on-demand to avoid SSG failures on problematic items
export const dynamic = "force-dynamic";
export const revalidate = 0;

const UI_VERSION = "product-fallback-v4";

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
  return /^[0-9]+$/.test(x);
}

function byParam(param: string) {
  const key = String(param || "");
  if (!key) return null;

  // numeric id (legacy)
  if (isNumeric(key)) {
    const asNum = Number(key);
    return products.find((p: any) => Number(p?.id) === asNum) ?? null;
  }

  // canonical slug
  const bySlug =
    products.find(
      (p: any) => String(p?.slug || "").toLowerCase() === key.toLowerCase()
    ) ?? null;
  if (bySlug) return bySlug;

  // title → slug fallback
  return products.find((p: any) => toSlug(p?.title) === key) ?? null;
}

function productImages(p: any): string[] {
  try {
    const arr = Array.isArray(p?.images) ? p.images.filter(Boolean) : [];
    const cover = (arr[0] ?? p?.image ?? "/images/placeholder.jpg") as string;
    const extras = arr.slice(1).filter(Boolean);
    const unique = Array.from(new Set([cover, ...extras])).slice(0, 8);
    return unique.map((src) =>
      src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`
    );
  } catch {
    return ["/images/placeholder.jpg"];
  }
}

/* --------------- metadata --------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = byParam(String(slug));
  const title = p
    ? `${p.title ?? "Product"} | Digital Products Artisan`
    : "Product | Digital Products Artisan";
  const description =
    p?.description ??
    "Explore premium digital downloads crafted for creators and entrepreneurs.";
  const canonical = p?.slug
    ? `https://digitalproductsartisan.com/products/${encodeURIComponent(
        String(p.slug)
      )}`
    : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, type: "product", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------------- page ---------------- */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = byParam(String(slug));
  if (!p) notFound();

  const title = String(p?.title ?? "Product");
  const category = p?.category ? String(p.category) : undefined;

  const priceVal =
    typeof p?.price === "number"
      ? p.price
      : Number(p?.price) && isFinite(Number(p?.price))
      ? Number(p?.price)
      : null;

  const priceLabel =
    priceVal != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(priceVal)
      : typeof p?.price === "string"
      ? String(p.price)
      : "";

  const imgs = productImages(p);

  const canonicalCategorySlug = category ? toSlug(category) : null;
  const canonicalProductSlug = String(p?.slug || toSlug(title));

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100]"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* Hardening: ensure nothing blocks clicks on this page */}
      <style>{`
        [data-ui^="ProductPage@"] a,
        [data-ui^="ProductPage@"] button,
        [data-ui^="ProductPage@"] [role="button"] {
          pointer-events: auto !important; position: relative; z-index: 20;
        }
        .hero-overlay,.gradient-overlay,.noise-overlay,.overlay,[data-overlay],[data-decorative="true"],
        [class*="overlay-"],[class$="-overlay"],.fixed-overlay,.absolute-overlay,[data-blocking-overlay="true"] {
          pointer-events: none !important; z-index: -1 !important;
        }
      `}</style>

      {/* Title + price */}
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="mt-1 text-gray-700">
        {p?.subtitle
          ? String(p.subtitle)
          : `A curated digital product${
              category ? ` in ${category}.` : `.`
            }`}
      </p>

      {priceLabel && (
        <div className="mt-4 text-2xl font-semibold">{priceLabel}</div>
      )}

      {/* Gallery & CTA */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="rounded-xl border bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgs[0] ?? "/images/placeholder.jpg"}
              alt={title}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {imgs.slice(1, 5).map((src, i) => (
                <div key={src + i} className="rounded-lg border bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">
            Instant download. Lifetime access.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/api/checkout?product=${encodeURIComponent(
                canonicalProductSlug
              )}&qty=1`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Buy now
            </Link>
            <Link
              href="/cart"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              View cart
            </Link>
          </div>

          {category && canonicalCategorySlug && (
            <p className="mt-4 text-xs text-gray-500">
              Category:{" "}
              <Link
                href={`/categories/${encodeURIComponent(
                  canonicalCategorySlug
                )}`}
                className="underline"
                prefetch={false}
              >
                {category}
              </Link>
            </p>
          )}
        </aside>
      </section>

      {/* Description */}
      <section className="mt-10 prose max-w-none">
        <h2>About this product</h2>
        <p>
          {p?.description
            ? String(p.description)
            : "High-quality digital resource crafted for creators and entrepreneurs."}
        </p>
      </section>
    </main>
  );
}
