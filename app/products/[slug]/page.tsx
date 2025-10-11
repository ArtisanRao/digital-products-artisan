// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// ✅ central catalog
import { products } from "@/data/products";

export const runtime = "nodejs";
// Keep it static/ISR so it never times out on Vercel
export const revalidate = 300;

const UI_VERSION = "product-fallback-v3";

/* ---------------------- helpers ---------------------- */

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
  // param can be a slug *or* a legacy numeric id
  if (isNumeric(param)) {
    const asNum = Number(param);
    return products.find((p: any) => Number(p.id) === asNum) ?? null;
  }
  // direct match by slug first
  const direct =
    products.find((p: any) => String(p.slug || "").toLowerCase() === param.toLowerCase()) ??
    null;
  if (direct) return direct;

  // fall back to title slug
  const viaTitle = products.find((p: any) => toSlug(p.title) === param) ?? null;
  return viaTitle;
}

function canonicalHref(p: any) {
  const slug = String(p.slug || toSlug(p.title));
  return `/products/${encodeURIComponent(slug)}`;
}

function productImages(p: any): string[] {
  const arr = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const cover = (arr[0] ?? p.image ?? "/images/placeholder.jpg") as string;
  const extras = arr.slice(1).filter(Boolean);
  const unique = Array.from(new Set([cover, ...extras])).slice(0, 8);
  // add a cache-buster tied to UI version so CDN flushes on deploy
  return unique.map((src) => (src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`));
}

/* ---------------------- metadata ---------------------- */

export async function generateStaticParams() {
  // prebuild both canonical slugs and numeric ids for legacy links
  const slugs = products
    .map((p: any) => String(p.slug || "").trim())
    .filter(Boolean);
  const ids = products
    .map((p: any) => p?.id)
    .filter((id: any) => id !== undefined && id !== null)
    .map((id: any) => String(id));

  return [...new Set([...slugs, ...ids])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = byParam(String(slug));
  const title = p ? `${p.title} | Digital Products Artisan` : "Product | Digital Products Artisan";
  const description = p?.description ?? "Explore premium digital downloads.";
  const canonical = p ? `https://digitalproductsartisan.com${canonicalHref(p)}` : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, type: "product", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------------------- page ---------------------- */

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Resolve product from slug or legacy id
  const p = byParam(String(slug));
  if (!p) notFound();

  // If user hit a numeric id or a title-slug, 301 to canonical product slug
  const target = canonicalHref(p);
  if (!String(slug).toLowerCase().includes(String(p.slug || toSlug(p.title)).toLowerCase())) {
    redirect(target);
  }

  const imgs = productImages(p);

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100] clickable-surface"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* Extra safety: make sure nothing overlays this page */}
      <style>{`
        [data-ui^="ProductPage@"] a,
        [data-ui^="ProductPage@"] button,
        [data-ui^="ProductPage@"] [role="button"] { pointer-events:auto !important; position:relative; z-index:20; }
        .hero-overlay,.gradient-overlay,.noise-overlay,.overlay,[data-overlay],[data-decorative="true"],
        [class*="overlay-"],[class$="-overlay"],.fixed-overlay,.absolute-overlay,[data-blocking-overlay="true"] {
          pointer-events:none !important; z-index:-1 !important;
        }
      `}</style>

      {/* Title + price */}
      <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
      {p.subtitle ? (
        <p className="mt-1 text-gray-700">{p.subtitle}</p>
      ) : (
        <p className="mt-1 text-gray-700">A curated digital product{p.category ? ` in ${p.category}.` : "."}</p>
      )}
      {p.price != null && (
        <div className="mt-4 text-2xl font-semibold">
          {typeof p.price === "number"
            ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.price)
            : String(p.price)}
        </div>
      )}

      {/* Gallery */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="rounded-xl border bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgs[0] ?? "/images/placeholder.jpg"}
              alt={p.title}
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

        {/* Buy / CTA box (simple, SSR-safe) */}
        <aside className="rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">
            Instant download. Lifetime access.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/api/checkout?product=${encodeURIComponent(String(p.slug || toSlug(p.title)))}&qty=1`}
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
          {p.category && (
            <p className="mt-4 text-xs text-gray-500">
              Category:{" "}
              <Link
                href={`/categories/${encodeURIComponent(toSlug(p.category))}`}
                className="underline"
                prefetch={false}
              >
                {p.category}
              </Link>
            </p>
          )}
        </aside>
      </section>

      {/* Description */}
      <section className="mt-10 prose max-w-none">
        <h2>About this product</h2>
        <p>{p.description || "High-quality digital resource crafted for creators and entrepreneurs."}</p>
      </section>
    </main>
  );
}
