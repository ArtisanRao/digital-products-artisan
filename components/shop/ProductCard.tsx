"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProductCardData = {
  title: string;
  slug?: string;                 // product slug (preferred)
  id?: string | number;          // numeric id (fallback)
  price?: number | string;
  images?: string[];             // cover first, then mockups
  href?: string;                 // explicit product URL (overrides slug/id)
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
  const pics = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );
  const [idx, setIdx] = useState(0);

  // Build a robust product URL that works with either /products/[slug] or /products/[id]
  const productHref =
    href ??
    (slug ? `/products/${slug}` : id !== undefined ? `/products/${id}` : "/products");

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  // ---- Cart / Checkout wiring ---------------------------------------------
  const addToCart = () => {
    try {
      const w = window as any;

      // Prefer your app's cart if it's exposed
      if (w?.dpaCart?.add) { w.dpaCart.add({ slug: slug ?? id, qty: 1 }); }
      else if (w?.__CART__?.add) { w.__CART__.add({ slug: slug ?? id, qty: 1 }); }
      else {
        // Fallback localStorage cart
        const key = "cart";
        const raw = localStorage.getItem(key);
        const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
        const keyName = String(slug ?? id ?? "");
        cart[keyName] = (cart[keyName] ?? 0) + 1;
        localStorage.setItem(key, JSON.stringify(cart));
      }

      // Notify badge
      const raw = localStorage.getItem("cart");
      const total = raw
        ? Object.values(JSON.parse(raw) as Record<string, number>).reduce((a, b) => a + Number(b), 0)
        : 0;
      window.dispatchEvent(new CustomEvent("cart:add", { detail: { slug: slug ?? id, qty: 1 } }));
      window.dispatchEvent(new CustomEvent("cart:count", { detail: total }));
    } catch (e) {
      console.error("addToCart error", e);
    }
  };

  const buyNow = () => {
    const w = window as any;
    if (w?.startCheckout) { w.startCheckout({ slug: slug ?? id }); return; }
    // Fallback: go to your checkout page with product param
    const keyName = String(slug ?? id ?? "");
    window.location.href = `/checkout?product=${encodeURIComponent(keyName)}`;
  };
  // -------------------------------------------------------------------------

  return (
    <article className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Main image (clickable) */}
      <Link href={productHref} aria-label={`Open ${title}`} className="block">
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
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              >
                ›
              </button>
            </>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Title (hover underline + clickable) */}
        <Link
          href={productHref}
          className="block hover:underline hover:decoration-2 hover:underline-offset-4"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbs (under hero) → each thumb also opens the product page */}
        {pics.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {pics.map((src, i) => (
              <Link
                key={src + i}
                href={productHref}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                  i === 0 ? "ring-0" : ""
                } opacity-90 hover:opacity-100`}
                aria-label={`Open ${title}`}
                title={`Open ${title}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </Link>
            ))}
          </div>
        )}

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Actions: single row, never wrap */}
        <div className="mt-3 grid grid-cols-3 items-stretch gap-2">
          <Link
            href={productHref}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2 md:px-3 text-xs md:text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2 md:px-3 text-xs md:text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Add to cart"
          >
            🛒 Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2 md:px-3 text-xs md:text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
