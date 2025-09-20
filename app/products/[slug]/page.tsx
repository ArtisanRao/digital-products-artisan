// app/products/[slug]/page.tsx
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

/** Thumbnail rail + main viewer with prev/next + hover zoom */
function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images?.length ? images : ["/images/placeholder-cover.jpg"];
  const [idx, setIdx] = React.useState(0);
  const n = safe.length;

  const go = (delta: number) => setIdx((i) => (i + delta + n) % n);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  return (
    <div className="grid grid-cols-[86px_1fr] gap-4 lg:gap-6">
      {/* Left rail */}
      <div className="flex max-h-[560px] flex-col gap-3 overflow-auto pr-1">
        {safe.map((src, i) => {
          const active = i === idx;
          return (
            <button
              key={src + i}
              type="button"
              onMouseEnter={() => setIdx(i)}
              onClick={() => setIdx(i)}
              aria-label={`Preview image ${i + 1}`}
              className={[
                "relative aspect-square w-[86px] overflow-hidden rounded-xl border transition",
                active
                  ? "ring-2 ring-blue-500 border-transparent"
                  : "border-gray-200 hover:border-blue-300",
              ].join(" ")}
            >
              <Image src={src} alt={`${alt} — preview ${i + 1}`} fill sizes="86px" className="object-cover" />
            </button>
          );
        })}
      </div>

      {/* Main viewer */}
      <div className="relative isolate rounded-2xl border bg-white">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            key={safe[idx]}
            src={safe[idx]}
            alt={alt}
            fill
            priority={idx === 0}
            sizes="(min-width:1024px) 720px, 100vw"
            className="object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Prev */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function ProductPageBySlug() {
  const params = useParams<{ slug: string }>();
  const handle = String(params?.slug ?? "");
  const p = findProduct(handle);

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const imgs: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];
  const cover = imgs[0] ?? "/images/placeholder-cover.jpg";

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
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      {/* LEFT: gallery with rail + prev/next */}
      <section>
        <ProductGallery images={imgs} alt={p.title} />
      </section>

      {/* RIGHT: info */}
      <section className="isolate">
        {/* Title is clickable and on top of overlays */}
        <h1 className="relative z-20 text-4xl font-extrabold leading-tight pointer-events-auto">
          <Link
            href={`/products/${encodeURIComponent(String(p.id))}`}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.price)}
        </div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div className="relative z-20 mt-6 flex flex-wrap gap-3 pointer-events-auto">
          {/* BUY — Stripe Checkout */}
          <Button
            type="button"
            onClick={handleBuy}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Buy
          </Button>

          {/* VIEW + ADD TO CART (stays put; badge updates via cart context/localStorage) */}
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
            buyEnabled={false} // we already render a Buy button above
          />
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
