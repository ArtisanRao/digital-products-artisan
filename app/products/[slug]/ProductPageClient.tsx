"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { products, productsById } from "@/data/products";
import { getPreferredCurrency } from "@/lib/currency";

/* --------------------------- helpers --------------------------- */

function findProduct(idOrSlug: string) {
  const raw = String(idOrSlug ?? "").trim();
  if (!raw) return null;

  const asNum = Number(raw);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as any)?.[asNum];
    if (byId) return byId;
    const linear = products.find((p) => Number(p.id) === asNum);
    if (linear) return linear;
  }

  const slugLc = raw.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slugLc) ||
    products.find((p) => String(p.id) === raw) ||
    null
  );
}

function normalizeImages(imgs?: string[] | null, fallback?: string) {
  const base = (Array.isArray(imgs) && imgs.length ? imgs : [fallback].filter(Boolean)) as string[];
  const seen = new Set<string>();
  const list: string[] = [];
  for (const src of base) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    list.push(src);
  }
  return list.length ? list : ["/images/placeholder.jpg"];
}

/* --------------------------- gallery --------------------------- */

function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images?.length ? images : ["/images/placeholder.jpg"];
  const [idx, setIdx] = React.useState(0);
  const n = safe.length;
  const go = (d: number) => setIdx((i) => (i + d + n) % n);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  return (
    <div className="relative grid grid-cols-[86px_1fr] gap-4 lg:gap-6" style={{ zIndex: 1 }}>
      {/* thumbs */}
      <div className="flex max-h-[560px] flex-col gap-3 overflow-auto pr-1">
        {safe.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onMouseEnter={() => setIdx(i)}
            onClick={() => setIdx(i)}
            className={[
              "relative aspect-square w-[86px] overflow-hidden rounded-xl border transition",
              i === idx ? "ring-2 ring-blue-500 border-transparent" : "border-gray-200 hover:border-blue-300",
            ].join(" ")}
            aria-label={`Preview image ${i + 1}`}
          >
            <Image src={src} alt={`${alt} — preview ${i + 1}`} fill sizes="86px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* main */}
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

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------- page --------------------------- */

export default function ProductPageClient({ slug }: { slug: string }) {
  const handle = String(slug ?? "");
  const p = findProduct(handle);

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  // cover + extras (dedup, ordered)
  const images = normalizeImages(p.images?.length ? p.images : [p.image], p.image);
  const coverImage = images[0];

  const currencyRaw = getPreferredCurrency();
  const currency = String(currencyRaw || "EUR").toUpperCase() as "EUR" | "USD";
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  const priceNumber = typeof p.price === "number" ? p.price : Number(p.price) || 0;
  const display = new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceNumber);

  const canonicalHref = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      {/* gallery */}
      <section style={{ zIndex: 1, position: "relative" }}>
        <ProductGallery images={images} alt={p.title} />
      </section>

      {/* details */}
      <section className="isolate" style={{ position: "relative", zIndex: 60, pointerEvents: "auto" }}>
        <h1
          className="text-4xl font-extrabold leading-tight"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Link
            href={canonicalHref}
            prefetch={false}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">{display}</div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        {/* uniform horizontal CTAs */}
        <div className="mt-6 grid grid-cols-2 gap-3" style={{ position: "relative", zIndex: 61 }}>
          <AddToCartButton
            productId={Number(p.id)}  {/* ← updated prop */}
            className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          />

          <Button
            asChild
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Link
              href={`/api/checkout?productId=${encodeURIComponent(String(p.id))}&qty=1&currency=${currency}`}
              prefetch={false}
            >
              Buy
            </Link>
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
