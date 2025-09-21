export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";
import { products, productsById } from "@/data/products";
import { notFound } from "next/navigation";

// Minimal, server-safe gallery (no client hooks needed)
function ServerGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images?.length ? images : ["/images/placeholder-cover.jpg"];
  return (
    <div className="relative isolate rounded-2xl border bg-white">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={safe[0]}
          alt={alt}
          fill
          sizes="(min-width:1024px) 720px, 100vw"
          className="object-contain"
          priority
        />
      </div>
      {safe.length > 1 && (
        <div className="grid grid-cols-4 gap-2 p-3">
          {safe.slice(1, 5).map((src, i) => (
            <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
              <Image src={src} alt={`${alt} preview ${i + 2}`} fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Look up by numeric ID or slug
function findProductSync(idOrSlug: string) {
  const asNum = Number(idOrSlug);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as Record<number, any>)?.[asNum];
    if (byId) return byId;
    const byIdLinear = products.find((p) => Number(p.id) === asNum);
    if (byIdLinear) return byIdLinear;
  }
  const slug = idOrSlug.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slug) ||
    products.find((p) => String(p.id) === idOrSlug) ||
    null
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  // ✅ Resolve product at request time on the server
  const handle = String(params?.slug ?? "");
  const p = findProductSync(handle);

  if (!p) {
    // If the URL truly doesn't match a product, return a real 404.
    // (If you prefer a soft “not found” message instead, render that UI here.)
    return notFound();
  }

  const imgs: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];
  const canonicalHref = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;

  // Display price as-is (your AddToCart/Checkout buttons handle currency)
  const priceDisplay = `€${Number(p.price).toFixed(2)}`;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <section style={{ zIndex: 1, position: "relative" }}>
        <ServerGallery images={imgs} alt={p.title} />
      </section>

      <section className="isolate" style={{ position: "relative", zIndex: 60, pointerEvents: "auto" }}>
        <h1
          className="text-4xl font-extrabold leading-tight"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Link
            href={canonicalHref}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">{priceDisplay}</div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3" style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}>
          <AddToCartButton
            productId={p.id}
            className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          />

          {/* Keep Buy button simple on server page; your existing client checkout flow can remain elsewhere */}
          <Button
            type="button"
            asChild
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Link href="/checkout">Buy</Link>
          </Button>
        </div>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>Instant download after purchase</li>
          <li>PLR / MRR license included (where stated)</li>
          <li>Secure checkout via Stripe</li>
        </ul>
      </section>
    </main>
  );
}
