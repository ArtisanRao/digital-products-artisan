// app/products/[slug]/page.tsx
import Link from "next/link";
import { products } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/shop/AddToCartButton";
import BuyNowButton from "@/components/shop/BuyNowButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 300;

const UI_VERSION = "product-hardened-v12";

/* ---------------- helpers ---------------- */
const toSlug = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isNumeric = (x: string) => /^[0-9]+$/.test(String(x || ""));
const sstr = (x: any, fb = "") => (typeof x === "string" ? x : fb);

function pickByParam(param: string) {
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
  } catch (e) {
    console.error("[PDP] pickByParam failed:", e);
    return null;
  }
}

const canonSlug = (p: any) => sstr(p?.slug) || toSlug(sstr(p?.title, "product"));
const canonHref = (p: any) => `/products/${encodeURIComponent(canonSlug(p))}`;

function productImages(p: any): string[] {
  try {
    const arr = Array.isArray(p?.images)
      ? (p.images as any[]).filter((x) => typeof x === "string" && x.trim())
      : [];
    const cover = sstr(arr[0] ?? p?.image, "/images/placeholder.jpg");
    const extras = arr.slice(1).filter((x) => typeof x === "string" && x.trim());
    const unique = Array.from(new Set([cover, ...extras])).slice(0, 12);
    return unique.map((raw) => {
      const src = sstr(raw, "/images/placeholder.jpg");
      return src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`;
    });
  } catch (e) {
    console.error("[PDP] productImages failed:", e);
    return ["/images/placeholder.jpg"];
  }
}

function sanitize(raw: any) {
  const out: any = {};
  try {
    out.id =
      typeof raw?.id === "number" || typeof raw?.id === "string" ? raw.id : undefined;
    out.slug = typeof raw?.slug === "string" ? raw.slug : undefined;
    out.title = typeof raw?.title === "string" ? raw.title : "Product";
    out.category = typeof raw?.category === "string" ? raw.category : "";
    out.price =
      typeof raw?.price === "number" || typeof raw?.price === "string" ? raw.price : "";
    out.images = Array.isArray(raw?.images)
      ? raw.images.filter((x: any) => typeof x === "string" && x.trim())
      : [];
    out.image = typeof raw?.image === "string" ? raw.image : undefined;
    out.description = typeof raw?.description === "string" ? raw.description : "";
  } catch (e) {
    console.error("[PDP] sanitize failed:", e);
  }
  return out;
}

async function getSlugFromParams(params: any): Promise<string> {
  try {
    const p = await Promise.resolve(params);
    return String(p?.slug ?? "");
  } catch (e) {
    console.error("[PDP] getSlugFromParams failed:", e);
    return "";
  }
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({ params }: any) {
  const slug = await getSlugFromParams(params);
  const raw = pickByParam(slug);

  if (!raw) {
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-gray-600">
          We couldn’t find that product.{" "}
          <Link href="/products" className="underline underline-offset-4 decoration-2">
            Browse all products
          </Link>
          .
        </p>
      </main>
    );
  }

  const p = sanitize(raw);
  const title = sstr(p.title, "Product");
  const category = sstr(p.category, "");
  const imgs = productImages(p);
  const canonical = canonHref(p);
  const slugForCheckout = String(canonSlug(p));

  let price = "";
  if (typeof p.price === "number") {
    try {
      price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(p.price);
    } catch {
      price = `$${p.price}`;
    }
  } else if (typeof p.price === "string") {
    price = p.price;
  }

  const safeImgs =
    Array.isArray(imgs) && imgs.length ? imgs : ["/images/placeholder.jpg"];

  // numeric id (for buttons)
  const productIdNum: number = (() => {
    const n = Number(p.id);
    if (Number.isFinite(n)) return n;
    const found = (products as any[]).find(
      (x: any) => String(x?.slug || "") === slugForCheckout
    );
    return Number(found?.id ?? 0);
  })();

  return (
    <main
      className="container mx-auto px-4 py-10 relative z-[100]"
      data-ui={`ProductPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      <section className="grid gap-6 md:grid-cols-[1fr_360px]">
        {/* LEFT: Gallery + Title/Subtitle */}
        <div className="flex flex-col gap-4">
          <ProductGallery images={safeImgs} alt={title} maxThumbs={4} />

          <div className="pt-1">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              <Link
                href={canonical}
                className="hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition"
                prefetch={false}
              >
                {title}
              </Link>
            </h1>

            {category ? (
              <div className="mt-1">
                <Link
                  href={`/categories/${encodeURIComponent(toSlug(category))}`}
                  className="text-gray-700 hover:underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition"
                  prefetch={false}
                >
                  {category}
                </Link>
              </div>
            ) : null}
          </div>

          {/* Details + More (blue) BELOW the About section */}
          <section id="details" className="mt-6 max-w-none">
            <h2 className="text-xl font-semibold mb-2">About this product</h2>
            <p className="mb-3">
              {typeof p.description === "string" && p.description.trim()
                ? p.description
                : "High-quality digital resource crafted for creators and entrepreneurs."}
            </p>

            <a
              href="#details"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              More
            </a>
          </section>
        </div>

        {/* RIGHT: Purchase box (silent Add + Buy now → payment) */}
        <aside className="rounded-xl border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold">Get this product</h2>
          <p className="mt-1 text-sm text-gray-600">Instant download. Lifetime access.</p>

          {price ? <div className="mt-4 text-2xl font-semibold">{price}</div> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {Number.isFinite(productIdNum) && productIdNum > 0 ? (
              <AddToCartButton productId={productIdNum} />
            ) : null}

            {Number.isFinite(productIdNum) && productIdNum > 0 ? (
              <BuyNowButton productId={productIdNum} productSlug={slugForCheckout} />
            ) : (
              <BuyNowButton productSlug={slugForCheckout} />
            )}
          </div>

          {category ? (
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
          ) : null}
        </aside>
      </section>
    </main>
  );
}
