// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

const UI_VERSION = "product-hardened-v8";

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
function safeString(x: any, fallback = ""): string {
  return typeof x === "string" ? x : fallback;
}
function byParam(param: string) {
  const needle = String(param || "").trim();
  if (!needle) return null;

  try {
    if (isNumeric(needle)) {
      const n = Number(needle);
      const hit = (products as any[]).find((p: any) => Number(p?.id) === n);
      if (hit) return hit;
    }
    const bySlug =
      (products as any[]).find(
        (p: any) => String(p?.slug || "").toLowerCase() === needle.toLowerCase()
      ) ?? null;
    if (bySlug) return bySlug;

    const byTitle =
      (products as any[]).find((p: any) => toSlug(p?.title) === needle) ?? null;
    return byTitle;
  } catch {
    return null;
  }
}
function canonicalSlug(p: any) {
  return safeString(p?.slug) || toSlug(safeString(p?.title, "product"));
}
function canonicalHref(p: any) {
  return `/products/${encodeURIComponent(canonicalSlug(p))}`;
}
function productImages(p: any): string[] {
  // only strings; dedupe; cap to 8; make absolute-ish strings safe
  const arr = Array.isArray(p?.images)
    ? (p.images as any[]).filter((x) => typeof x === "string" && x.trim())
    : [];
  const cover = safeString(arr[0] ?? p?.image, "/images/placeholder.jpg");
  const extras = arr.slice(1).filter((x) => typeof x === "string" && x.trim());
  const unique = Array.from(new Set([cover, ...extras])).slice(0, 8);

  return unique.map((raw) => {
    const src = safeString(raw, "/images/placeholder.jpg");
    const withV = src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`;
    return withV;
  });
}
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

/** Accept params as object or promise (Next 15-safe) */
async function getSlugFromParams(params: any): Promise<string> {
  try {
    const p = await Promise.resolve(params);
    return String(p?.slug ?? "");
  } catch {
    return "";
  }
}

/* --------- metadata (loose typing) --------- */
export async function generateMetadata({ params }: any) {
  const slug = await getSlugFromParams(params);
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
export default async function ProductPage({ params }: any) {
  const slug = await getSlugFromParams(params);

  // Resolve product or 404
  const raw = byParam(slug);
  if (!raw) notFound();

  // Harden all downstream reads
  const p = sanitizeProduct(raw);
  const title = safeString(p.title, "Product");
  const category = safeString(p.category, "");
  const imgs = productImages(p);
  const canonical = canonicalHref(p);

  let price = "";
  if (typeof p.price === "number") {
    try {
      price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        p.price
      );
    } catch {
      price = `$${p.price}`;
    }
  } else if (typeof p.price === "string") {
    price = p.price;
  }

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

      {/* Canonical hint */}
      <link rel="canonical" href={canonical} />

      {/* Title + subtitle + CTAs under it */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          <Link
            href={canonical}
            className="hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition"
            prefetch={false}
          >
            {title}
          </Link>
        </h1>

        {category && (
          <p className="mt-1 text-gray-700">
            <Link
              href={`/categories/${encodeURIComponent(toSlug(category))}`}
              className="hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition"
              prefetch={false}
            >
              {category}
            </Link>
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={imgs[0] || "#"}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            href={`/api/checkout?product=${encodeURIComponent(canonicalSlug(p))}&qty=1&mode=add`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600/90 px-4 py-2 text-white hover:bg-blue-600"
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

      {/* Media + Aside */}
      <section className="grid gap-6 md:grid-cols-[120px_1fr_360px]">
        {/* LEFT RAIL: vertical thumbnails */}
        <div className="hidden md:block">
          <div className="sticky top-24 flex max-h=[70vh] flex-col gap-2 overflow-auto pr-1">
            {imgs.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                src={src}
                alt=""
                className="w-full h-24 object-cover rounded-md border bg-white"
                loading={i < 3 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>

        {/* MAIN IMAGE */}
        <div>
          <div className="rounded-xl border bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(imgs[0] ?? "/images/placeholder.jpg") as string}
              alt={title}
              className="w-full h-auto object-contain"
              loading="eager"
            />
          </div>

          {/* mobile thumbs */}
          {imgs.length > 1 && (
            <div className="md:hidden mt-3 grid grid-cols-4 gap-2">
              {imgs.slice(1, 5).map((src, i) => (
                <div key={src + i} className="rounded-lg border bg-white p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-20 object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ASIDE */}
        <aside className="rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">Instant download. Lifetime access.</p>
          {price && <div className="mt-4 text-2xl font-semibold">{price}</div>}
          <div className="mt-4 flex gap-2">
            <Link
              href={`/api/checkout?product=${encodeURIComponent(canonicalSlug(p))}&qty=1`}
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
