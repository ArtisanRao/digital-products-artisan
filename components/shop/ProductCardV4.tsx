"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProductCardData = {
  title: string;
  slug?: string;
  id?: string | number;     // fallback if slug is missing
  price?: number | string;
  images?: string[];        // cover first, then mockups/thumbs
  href?: string;            // explicit href overrides slug/id
  description?: string;
};

export default function ProductCardV4({
  title,
  slug,
  id,
  price,
  images = [],
  href,
  description,
}: ProductCardData) {
  // Dedup and drop empties
  const pics = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );

  // Exactly 1 cover + 4 thumbs (pad with cover if needed)
  const displayPics = useMemo(() => {
    const cover = pics[0] ?? "/images/placeholder.jpg";
    const thumbs = pics.slice(1);
    while (thumbs.length < 4) thumbs.push(cover);
    return [cover, ...thumbs.slice(0, 4)];
  }, [pics]);

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? displayPics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % displayPics.length);

  // Robust URL: href → /products/<slug> → /products/<id> → /products (safe fallback)
  const productUrl = useMemo(() => {
    if (href && href.startsWith("/")) return href;
    if (slug) return `/products/${slug}`;
    if (id !== undefined && id !== null) return `/products/${encodeURIComponent(String(id))}`;
    return "/products";
  }, [href, slug, id]);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  // Cart + checkout wiring
  const addToCart = () => {
    try {
      const key = String(slug ?? id ?? "");
      if (!key) return;

      const w = window as any;

      if (w?.dpaCart?.add) { w.dpaCart.add({ slug: key, qty: 1 }); return; }
      if (w?.__CART__?.add) { w.__CART__.add({ slug: key, qty: 1 }); return; }

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
    const key = String(slug ?? id ?? "");
    if (!key) return;
    const w = window as any;
    if (w?.startCheckout) { w.startCheckout({ slug: key }); return; }
    window.location.href = `/checkout?product=${encodeURIComponent(key)}`;
  };

  return (
    <article
      className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      data-version="ProductCardV4@links-and-1plus4"
    >
      {/* Main image (click → product page) */}
      <Link href={productUrl} prefetch={false} aria-label={`Open ${title}`}>
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPics[idx]}
            alt={title}
            className="aspect-[3/2] w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {displayPics.length > 1 && (
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
        {/* Title (clickable → product page) */}
        <Link href={productUrl} prefetch={false} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold hover:text-blue-600">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Exactly 4 thumbs under the main preview — hover swaps, click navigates */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {displayPics.slice(1, 5).map((src, i) => (
            <Link
              key={src + i}
              href={productUrl}
              prefetch={false}
              aria-label={`Open ${title}`}
              onMouseEnter={() => setIdx(i + 1)} // hover shows that thumb as main
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                idx === i + 1 ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100"
              }`}
              title={`Preview ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </Link>
          ))}
        </div>

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Actions — aligned horizontally with equal widths */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Link
            href={productUrl}
            prefetch={false}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="Add to cart"
          >
            🛒 Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
