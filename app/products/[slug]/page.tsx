// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
// Render on demand and cache; flip to 0 while debugging if you want no cache.
export const revalidate = 300;
export const dynamicParams = true;
// Keep static caching after first render, but the try/catch below prevents hard crashes.
export const dynamic = "force-static";

const UI_VERSION = "product-hardened-v1";

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
  return String(p?.slug || toSlug(p?.title));
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = byParam(String(slug));
  const title = p
    ? `${p.title} | Digital Products Artisan`
    : "Product | Digital Products Artisan";
  const description =
    (typeof (p as any)?.description === "string" && (p as any).description) ||
    "Explore premium digital downloads.";
  const canonical = p
    ? `https://digitalproductsartisan.com${canonicalHref(p)}`
    : undefined;
  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, type: "product", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const p = byParam(String(slug));
    if (!p) return notFound();

    const target = canonicalHref(p).toLowerCase();
    const current = `/products/${encodeURIComponent(String(slug))}`.toLowerCase();
    if (current !== target) {
      // Safe canonicalization; if anything odd happens, we render instead of crashing.
      try {
        redirect(target);
      } catch {
        // fall through to render
      }
    }

    const pAny = p as any;
    const title = String(pAny?.title || "Product");
    const category =
      typeof pAny?.category === "string" && pAny.category.trim()
        ? pAny.category.trim()
        : "";
    const subtitle =
      typeof pAny?.subtitle === "string" && pAny.subtitle.trim()
        ? String(pAny.subtitle)
        : "";
    const price =
      typeof pAny?.price === "number"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            pAny.price
          )
        : typeof pAny?.price === "string"
        ? pAny.price
        : "";
    const imgs = productImages(pAny);

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

        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="mt-1 text-gray-700">
          {subtitle || `A curated digital product${category ? ` in ${category}.` : `.`}`}
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
                href={`/api/checkout?product=${encodeURIComponent(canonicalSlug(pAny))}&qty=1`}
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
            {typeof pAny?.description === "string" && pAny.description.trim()
              ? pAny.description
              : "High-quality digital resource crafted for creators and entrepreneurs."}
          </p>
        </section>
      </main>
    );
  } catch (err) {
    // This shows in Vercel → Deployment → Runtime Logs on the function invocation
    console.error("[product page] fatal error:", err);
    // Don’t crash the function; render a soft error page
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Product page error</h1>
        <p className="mt-2 text-gray-700">
          We couldn’t render this product. Please try again, or browse all products.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/products" className="underline" prefetch={false}>
            All products
          </Link>
          <button
            onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
            className="rounded border px-3 py-1"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }
}
