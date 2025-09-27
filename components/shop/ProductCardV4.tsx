"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type ProductCardData = {
  title: string;
  slug?: string;
  id?: string | number;
  price?: number | string;
  images?: string[];
  href?: string;
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
  // Dedup + drop empties
  const pics = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );

  // Cover + up to 3 unique extras (for the main carousel)
  const cover = pics[0] ?? "/images/placeholder.jpg";
  const extras = useMemo(
    () => pics.slice(1).filter((src) => src !== cover),
    [pics, cover]
  );
  const displayPics = useMemo(() => [cover, ...extras.slice(0, 3)], [cover, extras]);

  // Thumbs row: exactly 4 items; first = cover, then up to 3 extras; pad with cover
  const thumbsRow = useMemo(() => {
    const row = [cover, ...extras.slice(0, 3)];
    while (row.length < 4) row.push(cover);
    return row;
  }, [cover, extras]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= displayPics.length) setIdx(0);
  }, [displayPics.length, idx]);

  const prev = () => setIdx((i) => (i === 0 ? displayPics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % displayPics.length);

  // Canonical URL (href → slug → id → /products)
  const productUrl = useMemo(() => {
    if (href && href.startsWith("/")) return href;
    if (slug) return `/products/${encodeURIComponent(slug)}`;
    if (id !== undefined && id !== null)
      return `/products/${encodeURIComponent(String(id))}`;
    return "/products";
  }, [href, slug, id]);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : price ?? "";

  // Cart & checkout
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
      data-version="ProductCardV4@1cover+3extras+4thumbs-compact-ctas"
    >
      {/* Main image (click → product page) */}
      <Link href={productUrl} prefetch={false} aria-label={`Open ${title}`}>
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPics[idx] ?? "/images/placeholder.jpg"}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-sm shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-sm shadow hover:bg-white"
              >
                ›
              </button>
            </>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Title (click → product page) */}
        <Link href={productUrl} prefetch={false} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold hover:text-blue-600">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Exactly 4 thumbs (first = cover, then up to 3 extras; padded with cover) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {thumbsRow.map((src, i) => {
            const active = i < displayPics.length ? idx === i : idx === 0; // padded → cover
            return (
              <Link
                key={`${src}-${i}`}
                href={productUrl}
                prefetch={false}
                aria-label={`Open ${title} (preview ${i + 1})`}
                title={`Open ${title}`}
                onMouseEnter={() => setIdx(i < displayPics.length ? i : 0)}
                onFocus={() => setIdx(i < displayPics.length ? i : 0)}
                className={[
                  "block h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition",
                  active ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100",
                ].join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </Link>
            );
          })}
        </div>

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Compact CTAs (smaller so “Add / cart” fits) */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Link
            href={productUrl}
            prefetch={false}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2.5 text-[12px] leading-tight text-white hover:bg-blue-700 text-center"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2 text-[12px] leading-tight text-white hover:bg-blue-700 text-center"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <span className="flex flex-col items-center">
              <span>🛒 Add&nbsp;to</span>
              <span>cart</span>
            </span>
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="flex h-10 items-center justify-center rounded-xl bg-blue-600 px-2.5 text-[12px] leading-tight text-white hover:bg-blue-700 text-center"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
