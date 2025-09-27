"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import * as cart from "@/lib/cart";

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
  const pics = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );

  // 1 main + 3 thumbs (<=4 total)
  const cover = pics[0] ?? "/images/placeholder.jpg";
  const extras = useMemo(() => pics.slice(1).filter((s) => s !== cover), [pics, cover]);
  const displayPics = useMemo(() => [cover, ...extras.slice(0, 3)], [cover, extras]);

  // Thumbs row (pad to 4)
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

  // Canonical URL
  const productUrl = useMemo(() => {
    if (href && href.startsWith("/")) return href;
    if (slug) return `/products/${encodeURIComponent(slug)}`;
    if (id !== undefined && id !== null) return `/products/${encodeURIComponent(String(id))}`;
    return "/products";
  }, [href, slug, id]);

  const priceNumber = typeof price === "number" ? price : Number(price) || 0;

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : price ?? "";

  // Fall-back add for pages without the delegated wire
  const addToCart = () => {
    const key = String(slug ?? id ?? "");
    if (!key) return;
    cart.add(key, 1, {
      title,
      price: priceNumber,
      image: cover,
    });
  };

  const buyNow = () => {
    const key = String(slug ?? id ?? "");
    if (!key) return;
    const w = (window as any);
    if (w?.startCheckout) { w.startCheckout({ slug: key }); return; }
    window.location.href = `/checkout?product=${encodeURIComponent(key)}`;
  };

  return (
    <article
      className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      data-version="ProductCardV4@cart-unified+delegated"
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-[11px] shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-[11px] shadow hover:bg-white"
              >
                ›
              </button>
            </>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Title (hover underline) */}
        <Link href={productUrl} prefetch={false} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold hover:underline">{title}</h3>
        </Link>

        {/* Subtitle + “More” pill to #description */}
        {description && (
          <>
            <Link href={productUrl} prefetch={false} className="block mt-1">
              <p className="line-clamp-2 text-sm text-gray-600 hover:underline">
                {description}
              </p>
            </Link>
            <Link
              href={`${productUrl}#description`}
              prefetch={false}
              className="mt-2 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              aria-label={`Read more about ${title}`}
            >
              More
            </Link>
          </>
        )}

        {/* Thumbs (exactly 4 UI slots) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {thumbsRow.map((src, i) => {
            const isReal = i < displayPics.length;
            const targetIndex = isReal ? i : 0;
            const active = idx === targetIndex;
            return (
              <button
                type="button"
                key={`${src}-${i}`}
                onClick={(e) => { e.preventDefault(); setIdx(targetIndex); }}
                aria-label={`Preview ${title} (image ${targetIndex + 1})`}
                aria-pressed={active}
                className={[
                  "block h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition cursor-pointer",
                  active ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100",
                ].join(" ")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* CTAs — icons in fixed slots; middle wider; delegated add-to-cart attrs */}
        <div className="mt-3 grid gap-2 [grid-template-columns:.9fr_1.2fr_.9fr]">
          <Link
            href={productUrl}
            prefetch={false}
            className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label={`View ${title}`}
          >
            <span aria-hidden className="inline-block w-3 text-center">👁️</span>
            <span>View</span>
          </Link>

          <button
            type="button"
            // Fallback: only run locally when delegated handler isn't active
            onClick={() => {
              if (typeof document !== "undefined" &&
                  (document.documentElement as any)?.dataset?.delegatedCart === "1") {
                return; // let the delegated listener handle it
              }
              addToCart();
            }}
            // 👇 Delegated wire hooks for the All Products page
            data-add-to-cart
            data-product-id={String(id ?? "")}
            data-product-slug={slug ?? ""}
            data-qty="1"
            className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-3 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Add to cart"
          >
            <span aria-hidden className="inline-block w-5 text-center">🛒</span>
            <span>Add to cart</span>
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Buy now"
          >
            <span aria-hidden className="inline-block w-3 text-center">⚡</span>
            <span>Buy</span>
          </button>
        </div>
      </div>
    </article>
  );
}
