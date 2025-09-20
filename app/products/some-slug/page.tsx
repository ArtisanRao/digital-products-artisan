"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import ShopActions from "@/components/shop-actions";
import { products, productsById } from "@/data/products";

/** Find a product by numeric id or slug (case-insensitive) */
function findProduct(idOrSlug: string) {
  const asNum = Number(idOrSlug);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as any)?.[asNum];
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

export default function ProductPageBySlug() {
  const params = useParams<{ slug: string }>();
  const handle = String(params?.slug ?? "");
  const p = findProduct(handle);

  if (!p) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const images: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];
  const cover = images[0] ?? "/images/placeholder-cover.jpg";

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p.id, qty: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.2fr_.8fr] gap-8">
      {/* Left: gallery */}
      <section className="space-y-4">
        <div className="relative aspect-[4/3] rounded-xl border overflow-hidden bg-white">
          <Image
            src={cover}
            alt={p.title}
            fill
            priority
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-contain"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(1).map((src) => (
              <div key={src} className="relative aspect-[4/3] rounded-lg border overflow-hidden bg-white">
                <Image src={src} alt={p.title} fill sizes="33vw" className="object-contain" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right: info */}
      <section className="isolate">
        {/* Clickable title on top of any overlays */}
        <h1 className="text-3xl font-bold relative z-20 pointer-events-auto">
          <Link
            href={`/products/${encodeURIComponent(String(p.id))}`}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            aria-label={`Open product page for ${p.title}`}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-2 text-2xl font-semibold">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.price)}
        </div>

        <div className="mt-3 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 relative z-20 pointer-events-auto">
          {/* BUY — opens Stripe Checkout */}
          <Button
            type="button"
            onClick={handleBuy}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Buy
          </Button>

          {/* View + Add to cart (stay put) */}
          <ShopActions
            item={{
              id: String(p.id),
              title: p.title,
              price: p.price,
              image: cover,
              description: p.description,
            }}
            viewHref={`/products/${encodeURIComponent(String(p.id))}`}
            goToCartAfterAdd={false}
            buyEnabled={false} // Buy button is already present above
          />
        </div>

        <ul className="mt-6 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Instant download after purchase</li>
          <li>PLR / MRR license included (where stated)</li>
          <li>Secure checkout via Stripe</li>
        </ul>
      </section>
    </main>
  );
}
