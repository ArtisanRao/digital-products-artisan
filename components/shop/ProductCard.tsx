"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProductCardData = {
  title: string;
  slug?: string;
  id?: string | number;     // fallback if slug is missing
  price?: number | string;
  images?: string[];        // cover first, then mockups
  href?: string;            // explicit href overrides slug/id
  description?: string;
};

export default function ProductCard({
  title,
  slug,
  id,
  price,
  images = [],
  href,
  description,
}: ProductCardData) {
  // Dedupe images & ensure at least one placeholder
  const pics = useMemo(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    return unique.length ? unique : ["/images/placeholder.jpg"];
  }, [images]);

  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);
  const go = (i: number) => setIdx(i);

  // Robust URL: href → /products/<slug> → /products/<id> → /products
  const productUrl = useMemo(() => {
    if (href) return href;
    if (slug) return `/products/${slug}`;
    if (id !== undefined && id !== null) return `/products/${id}`;
    return "/products";
  }, [href, slug, id]);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  // Cart + checkout wiring
  const addToCart = () => {
    try {
      const key = String(slug ?? id);
      const w = window as any;

      // Prefer site cart if exposed
      if (w?.dpaCart?.add) { w.dpaCart.add({ slug: key, qty: 1 }); return; }
      if (w?.__CART__?.add) { w.__CART__.add({ slug: key, qty: 1 }); return; }

      // Fallback: localStorage + events for badge
      window.dispatchEvent(new CustomEvent("cart:add", { detail: { slug: key, qty: 1 } }));
      const raw = localStorage.getItem("cart");
      const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
      cart[key] = (cart[key] ?? 0) + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      const count = Object.values(cart).reduce((a, b) => a + Number(b), 0);
      window.dispatchEvent(new CustomEvent("cart:count", { detail: count }));
    } catch (e) {
      console.error("addToCart fallback error", e);
    }
  };

  const buyNow = () => {
    const key = String(slug ?? id);
    const w = window as any;
    if (w?.startCheckout) { w.startCheckout({ slug: key }); return; }
    window.location.href = `/checkout?product=${encodeURIComponent(key)}`;
  };

  // Exactly up to 4 thumbs
  const thumbs = pics.slice(0, 4);

  return (
    <article
      className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      data-version="ProductCard@v6"
    >
      {/* Main image (clickable) */}
      <Link href={productUrl} aria-label={`Open ${title}`} prefetch={false}>
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
          <img
            src={pics[idx]}
            alt={title}
            className="aspect-[3/2] w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {pics.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); prev(); }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              >
                ›
              </button>
            </>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Title (clickable) */}
        <Link href={productUrl} className="block" prefetch={false}>
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbs (max 4) */}
        {thumbs.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {thumbs.map((src, i) => (
              <button
                type="button"
                key={src + i}
                onClick={() => go(i)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                  idx === i ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100"
                }`}
                aria-label={`Preview ${i + 1}`}
                title={`Preview ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Actions (uniform blue) */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Link
            href={productUrl}
            prefetch={false}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="Add to cart"
          >
            🛒 Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
