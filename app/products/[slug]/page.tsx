// app/products/[slug]/page.tsx
import Link from "next/link";
import { products as _products } from "@/data/products";

export const runtime = "nodejs";
export const revalidate = 300;

const UI_VERSION = "product-hardened-v9";

/* ---------------- helpers ---------------- */
const toSlug = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isNumeric = (x: string) => /^[0-9]+$/.test(String(x || ""));

function getProductsArray() {
  // If the import isn’t an array for any reason, guard it
  try {
    return Array.isArray(_products) ? _products : [];
  } catch {
    return [];
  }
}

function byParam(param: string) {
  const needle = String(param || "").trim();
  if (!needle) return null;

  const products = getProductsArray();

  // by numeric id
  if (isNumeric(needle)) {
    const n = Number(needle);
    const hit = products.find((p: any) => Number(p?.id) === n);
    if (hit) return hit;
  }

  // by slug
  const bySlug =
    products.find(
      (p: any) => String(p?.slug || "").toLowerCase() === needle.toLowerCase()
    ) ?? null;
  if (bySlug) return bySlug;

  // by normalized title
  const byTitle = products.find((p: any) => toSlug(p?.title) === needle) ?? null;
  return byTitle;
}

const canonicalSlug = (p: any) => String(p?.slug || toSlug(p?.title || "product"));

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

/* ---------------- PAGE ---------------- */
export default async function ProductPage(props: any) {
  const { params } = props || {};
  // Next 15 sometimes passes plain object; normalize without assuming a Promise
  const safeParams = (await Promise.resolve(params)) || {};
  const slug = String(safeParams.slug ?? "");

  try {
    const raw = byParam(slug);

    // No hard throws — render soft-not-found instead
    if (!raw) {
      const safeSlug = toSlug(slug || "product");
      return (
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold">Product not found</h1>
          <p className="mt-2 text-gray-700">
            We couldn’t find that item. It may have been moved or renamed.
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

    const p = sanitizeProduct(raw);
    const title = p.title || "Product";
    const category = p.category || "";

    let priceText = "";
    if (typeof p.price === "number") {
      try {
        priceText = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(p.price);
      } catch {
        priceText = `$${p.price.toFixed?.(2) ?? String(p.price)}`;
      }
    } else if (typeof p.price === "string") {
      priceText = p.price;
    }

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
    console.error("[products/[slug]] render error:", err);
    // Non-throw fallback so error boundary won’t trigger
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold">Product page error</h1>
        <p className="mt-2 text-gray-700">
          Something went wrong while loading this product.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/products" prefetch={false} className="underline">
            All products
          </Link>
          <Link href="/" prefetch={false} className="underline">
            Home
          </Link>
        </div>
      </main>
    );
  }
}
