// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const revalidate = 300;
export const dynamicParams = true;
// Let Next statically cache per-slug but still allow runtime rendering paths.
export const dynamic = "force-static";

const UI_VERSION = "product-hardened-v3";

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
  return String(p?.slug || toSlug(p?.title || ""));
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

/* ---------------- SAFE metadata (no data access) ---------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = byParam(String(slug));
  if (!p) {
    return notFound();
  }

  // If URL isn't canonical, redirect (do NOT catch this)
  const target = canonicalHref(p).toLowerCase();
  const current = `/products/${encodeURIComponent(String(slug))}`.toLowerCase();
  if (current !== target) {
    redirect(target);
  }

  const title = String((p as any)?.title || "Product");
  const category =
    typeof (p as any)?.category === "string" && (p as any).category.trim()
      ? (p as any).category.trim()
      : "";
  const price =
    typeof (p as any)?.price === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format((p as any).price)
      : typeof (p as any)?.price === "string"
      ? (p as any).price
      : "";
  const imgs = productImages(p);

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100] clickable-surface"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* Click-through hardening (no overlays above product UI) */}
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

      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="mt-1 text-gray-700">
        {`A curated digital product${category ? ` in ${category}.` : `.`}`}
      </p>
      {price && <div className="mt-4 text-2xl font-semibold">{price}</div>}

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
                  <img src={src} alt="" className="w-full h-20 object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">Instant download. Lifetime access.</p>
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
          {typeof (p as any)?.description === "string" && (p as any).description.trim()
            ? (p as any).description
            : "High-quality digital resource crafted for creators and entrepreneurs."}
        </p>
      </section>
    </main>
  );
}
