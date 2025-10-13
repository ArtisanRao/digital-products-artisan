// app/products/[slug]/page.tsx
import Link from "next/link";
import { products } from "@/data/products";
import ProductGallery from "@/components/ProductGalleryV2";
import AddToCartButton from "@/components/shop/AddToCartButton";
import BuyNowButton from "@/components/shop/BuyNowButton";
import { getLongDescription } from "@/lib/description"; // uses the fallback logic

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 300;

const UI_VERSION = "product-hardened-v14";

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

/** Normalize + pick all description-related fields for consistent rendering */
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

    // ---- description-related fields ----
    out.shortDescription =
      typeof raw?.shortDescription === "string" ? raw.shortDescription : "";
    out.longDescription =
      typeof raw?.longDescription === "string" ? raw.longDescription : "";
    out.description = typeof raw?.description === "string" ? raw.description : ""; // legacy
    out.features = Array.isArray(raw?.features)
      ? raw.features.filter((x: any) => typeof x === "string" && x.trim())
      : [];
    out.includes = Array.isArray(raw?.includes)
      ? raw.includes.filter((x: any) => typeof x === "string" && x.trim())
      : [];
    out.license = typeof raw?.license === "string" ? raw.license : "";
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

/* ---------------- small render utils ---------------- */
function renderParagraphs(mdOrText: string) {
  const chunks = String(mdOrText || "").trim().split(/\n{2,}/g);
  return chunks.map((c, i) => (
    <p key={i} className="mb-3">
      {c}
    </p>
  ));
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

  const safeImgs = Array.isArray(imgs) && imgs.length ? imgs : ["/images/placeholder.jpg"];

  // numeric id (for buttons)
  const productIdNum: number = (() => {
    const n = Number(p.id);
    if (Number.isFinite(n)) return n;
    const found = (products as any[]).find(
      (x: any) => String(x?.slug || "") === slugForCheckout
    );
    return Number(found?.id ?? 0);
  })();

  // unified description content (uses fallback when long is light)
  const long = getLongDescription({
    ...p,
    longDescription: p.longDescription || p.description, // prefer new, fallback to legacy
  } as any);

  const hasFeatures = Array.isArray(p.features) && p.features.length > 0;
  const hasIncludes = Array.isArray(p.includes) && p.includes.length > 0;
  const hasLicense = typeof p.license === "string" && p.license.trim().length > 0;

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

          {/* Details + More (blue) */}
          <section id="details" className="mt-6 max-w-none">
            <h2 className="text-xl font-semibold mb-2">About this product</h2>

            <div className="prose prose-neutral max-w-none">
              {p.shortDescription?.trim() ? (
                <p className="mb-3">{p.shortDescription.trim()}</p>
              ) : null}

              <details>
                <summary>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer select-none">
                    More
                  </span>
                </summary>

                <div className="mt-4">
                  {renderParagraphs(long)}

                  {hasFeatures && (
                    <>
                      <h3 className="text-lg font-semibold mt-6">Key features</h3>
                      <ul className="list-disc pl-6 mt-2">
                        {p.features.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {hasIncludes && (
                    <>
                      <h3 className="text-lg font-semibold mt-6">What’s included</h3>
                      <ul className="list-disc pl-6 mt-2">
                        {p.includes.map((it: string, i: number) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {hasLicense && (
                    <p className="mt-6 text-sm text-gray-600">
                      <strong>License:</strong> {p.license}
                    </p>
                  )}
                </div>
              </details>
            </div>
          </section>
        </div>

        {/* RIGHT: Purchase box */}
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
