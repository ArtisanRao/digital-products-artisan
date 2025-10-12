// app/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

const UI_VERSION = "product-hardened-v6";

/* ---------------- tiny helpers ---------------- */
const toSlug = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isNumeric = (x: string) => /^[0-9]+$/.test(String(x || ""));

function byParam(param: string) {
  const needle = String(param || "").trim();
  if (!needle) return null;

  if (isNumeric(needle)) {
    const n = Number(needle);
    const byId = products.find((p: any) => Number(p?.id) === n);
    if (byId) return byId;
  }

  const bySlug =
    products.find(
      (p: any) => String(p?.slug || "").toLowerCase() === needle.toLowerCase()
    ) ?? null;
  if (bySlug) return bySlug;

  const byTitle = products.find((p: any) => toSlug(p?.title) === needle) ?? null;
  return byTitle;
}

const canonicalSlug = (p: any) => String(p?.slug || toSlug(p?.title || "product"));
const canonicalHref = (p: any) => `/products/${encodeURIComponent(canonicalSlug(p))}`;

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

/** Strip to plain JSON-friendly values only */
function sanitizeProduct(raw: any) {
  const out: any = {};
  if (!raw || typeof raw !== "object") return out;
  out.id = typeof raw.id === "number" || typeof raw.id === "string" ? raw.id : undefined;
  out.slug = typeof raw.slug === "string" ? raw.slug : undefined;
  out.title = typeof raw.title === "string" ? raw.title : "Product";
  out.category = typeof raw.category === "string" ? raw.category : "";
  out.price =
    typeof raw.price === "number" || typeof raw.price === "string" ? raw.price : "";
  out.images = Array.isArray(raw.images)
    ? raw.images.filter((x: any) => typeof x === "string" && x.trim())
    : [];
  out.image = typeof raw.image === "string" ? raw.image : undefined;
  out.description = typeof raw.description === "string" ? raw.description : "";
  return out;
}

/* ------- keep metadata generic to avoid data-time throws ------- */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const raw = byParam(String(slug));
  if (!raw) notFound();

  // Defensively render everything; never throw from RSC render
  try {
    const p = sanitizeProduct(raw);
    const title = p.title || "Product";
    const category = p.category || "";
    const priceText =
      typeof p.price === "number"
        ? `$${p.price.toFixed(2)}`
        : typeof p.price === "string"
        ? p.price
        : "";
    const imgs = productImages(p);

    return (
      <main
        className="container mx-auto px-4 py-10 relative z-[100] clickable-surface"
        data-ui={`ProductPage@${UI_VERSION}`}
        style={{ pointerEvents: "auto", isolation: "isolate" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="mt-1 text-gray-700">
          {`A curated digital product${category ? ` in ${category}.` : `.`}`}
        </p>
        {priceText && <div className="mt-4 text-2xl font-semibold">{priceText}</div>}

        <section className="mt-8 grid gap-6 md:grid-cols-2">
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
            {typeof p.description === "string" && p.description.trim()
              ? p.description
              : "High-quality digital resource crafted for creators and entrepreneurs."}
          </p>
        </section>
      </main>
    );
  } catch (err) {
    // Render a non-throwing fallback to avoid 500s due to unexpected data
    const safeSlug = toSlug(String(slug || "product"));
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold">Product</h1>
        <p className="mt-2 text-gray-700">
          We’re sorry — this product couldn’t be displayed right now.
        </p>
        <div className="mt-6">
          <Link href="/products" prefetch={false} className="underline">
            Browse all products →
          </Link>
          <span className="ml-2 text-xs text-gray-500 align-middle">({safeSlug})</span>
        </div>
      </main>
    );
  }
}
