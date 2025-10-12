// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { products } from "@/data/products";

// ✅ Server on Node, ISR for reliability
export const runtime = "nodejs";
export const revalidate = 300;
export const dynamic = "force-static";

const UI_VERSION = "product-fallback-v4";

// ---------- helpers ----------
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

  // legacy numeric id
  if (isNumeric(needle)) {
    const asNum = Number(needle);
    const hit = products.find((p: any) => Number(p?.id) === asNum);
    if (hit) return hit;
  }
  // canonical slug
  const hitBySlug =
    products.find(
      (p: any) =>
        String(p?.slug || "").toLowerCase() === needle.toLowerCase()
    ) ?? null;
  if (hitBySlug) return hitBySlug;

  // title → slug fallback
  const hitByTitle =
    products.find((p: any) => toSlug(p?.title) === needle) ?? null;
  return hitByTitle;
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

// ---------- metadata ----------
export async function generateStaticParams() {
  const slugs = products
    .map((p: any) => String(p?.slug || "").trim())
    .filter(Boolean);
  const ids = products
    .map((p: any) => p?.id)
    .filter((id: any) => id !== undefined && id !== null)
    .map((id: any) => String(id));
  return [...new Set([...slugs, ...ids])].map((slug) => ({ slug }));
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
    (typeof p?.description === "string" && p.description) ||
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

// ---------- page ----------
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = byParam(String(slug));
  if (!p) notFound();

  // Only redirect if the canonical path is different
  const currentPath = `/products/${encodeURIComponent(String(slug))}`.toLowerCase();
  const target = canonicalHref(p).toLowerCase();
  if (currentPath !== target) {
    redirect(target);
  }

  // Defensive locals
  const title = String(p?.title || "Product");
  const category =
    typeof p?.category === "string" && p.category.trim()
      ? p.category.trim()
      : "";
  const price =
    typeof p?.price === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(p.price)
      : typeof p?.price === "string"
      ? p.price
      : "";
  const imgs = productImages(p);

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

      {/* Title + subline */}
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="mt-1 text-gray-700">
        {typeof p?.subtitle === "string" && p.subtitle.trim()
          ? String(p.subtitle)
          : `A curated digital product${category ? ` in ${category}.` : `.`}`}
      </p>
      {price && <div className="mt-4 text-2xl font-semibold">{price}</div>}

      {/* Gallery + buy box */}
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
          {typeof p?.description === "string" && p.description.trim()
            ? p.description
            : "High-quality digital resource crafted for creators and entrepreneurs."}
        </p>
      </section>
    </main>
  );
}
