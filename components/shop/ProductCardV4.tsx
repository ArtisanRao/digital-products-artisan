// components/shop/ProductCardV4.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CatLink from "@/components/ui/CatLink";
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
  const pics = useMemo(() => Array.from(new Set((images || []).filter(Boolean))), [images]);

  // 1 main + up to 3 thumbs
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

  // Fallback add to cart
  const addToCart = () => {
    const key = String(slug ?? id ?? "");
    if (!key) return;
    cart.add(key, 1, { title, price: priceNumber, image: cover });
  };

  // Direct checkout link
  const buyHref = useMemo(() => {
    const idStr = id != null ? String(id) : "";
    if (idStr) return `/api/checkout?productId=${encodeURIComponent(idStr)}&qty=1`;
    const handle = slug ? String(slug) : "";
    return handle ? `/api/checkout?product=${encodeURIComponent(handle)}&qty=1` : productUrl;
  }, [id, slug, productUrl]);

  return (
    <CatLink
      href={productUrl}
      prefetch={false}
      data-card-link
      aria-label={`Open ${title}`}
      className="group block rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      // The anchor is the click target; children visuals won't eat clicks.
    >
      {/* Visuals (no pointer events) */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50 pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayPics[idx] ?? "/images/placeholder.jpg"}
          alt={title}
          className="aspect-[3/2] w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
          draggable={false}
        />
        {displayPics.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                prev();
              }}
              aria-label="Previous"
              className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-[11px] shadow hover:bg-white"
              data-allow-events="true"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                next();
              }}
              aria-label="Next"
              className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-[11px] shadow hover:bg-white"
              data-allow-events="true"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Content (no pointer events except explicit controls) */}
      <div className="p-4 pointer-events-none select-none">
        <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-blue-600">
          {title}
        </h3>

        {description && (
          <>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
            <a
              href={`${productUrl}#description`}
              className="pointer-events-auto mt-2 inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              aria-label={`Read more about ${title}`}
              data-allow-events="true"
            >
              More
            </a>
          </>
        )}

        {/* Thumbs */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {thumbsRow.map((src, i) => {
            const isReal = i < displayPics.length;
            const targetIndex = isReal ? i : 0;
            const active = idx === targetIndex;
            return (
              <button
                type="button"
                key={`${src}-${i}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIdx(targetIndex);
                }}
                aria-label={`Preview ${title} (image ${targetIndex + 1})`}
                aria-pressed={active}
                className={[
                  "pointer-events-auto block h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition cursor-pointer",
                  active ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100",
                ].join(" ")}
                data-allow-events="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* CTAs (explicitly opt back in to events) */}
        <div className="mt-3 grid gap-2 [grid-template-columns:.9fr_1.2fr_.9fr]">
          <a
            href={productUrl}
            className="pointer-events-auto inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label={`View ${title}`}
            data-allow-events="true"
          >
            <span aria-hidden className="inline-block w-3 text-center">👁️</span>
            <span>View</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (
                typeof document !== "undefined" &&
                (document.documentElement as any)?.dataset?.delegatedCart === "1"
              ) {
                return; // delegated listener will handle
              }
              addToCart();
            }}
            data-add-to-cart
            data-product-id={String(id ?? "")}
            {...(slug ? { "data-product-slug": slug } : {})}
            data-qty="1"
            className="pointer-events-auto inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-3 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Add to cart"
            data-allow-events="true"
          >
            <span aria-hidden className="inline-block w-5 text-center">🛒</span>
            <span>Add to cart</span>
          </button>

          <a
            href={buyHref}
            className="pointer-events-auto inline-flex !h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 !px-2 text-xs font-medium leading-tight text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Buy now"
            data-allow-events="true"
          >
            <span aria-hidden className="inline-block w-3 text-center">⚡</span>
            <span>Buy</span>
          </a>
        </div>
      </div>
    </CatLink>
  );
}
