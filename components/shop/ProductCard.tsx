"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

export default function ProductCard({
  title,
  slug,
  id,
  price,
  images = [],
  href,
  description,
}: ProductCardData) {
  const pics = useMemo(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    return unique.length ? unique : ["/images/placeholder.jpg"];
  }, [images]);

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);
  const go = (i: number) => setIdx(i);

  const productUrl = useMemo(() => {
    if (href) return href;
    if (slug) return `/products/${encodeURIComponent(slug)}`;
    if (id !== undefined && id !== null) return `/products/${encodeURIComponent(String(id))}`;
    return "/products";
  }, [href, slug, id]);

  const priceNumber = typeof price === "number" ? price : Number(price) || 0;

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  // 🔗 Use unified cart
  const addToCart = () => {
    const key = String(slug ?? id ?? "");
    if (!key) return;
    cart.add(key, 1, { title, price: priceNumber, image: pics[0] });
  };

  const buyNow = () => {
    const key = String(slug ?? id);
    const w = window as any;
    if (w?.startCheckout) { w.startCheckout({ slug: key }); return; }
    window.location.href = `/checkout?product=${encodeURIComponent(key)}`;
  };

  const thumbs = pics.slice(0, 4);

  return (
    <article className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
        <Link href={productUrl} className="block" prefetch={false}>
          <h3 className="line-clamp-2 text-lg font-semibold hover:underline">{title}</h3>
        </Link>

        {description && (
          <>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 hover:underline">{description}</p>
            <Link
              href={productUrl}
              prefetch={false}
              className="mt-1 inline-block text-sm font-medium text-blue-600 group-hover:underline"
              aria-label={`More about ${title}`}
            >
              More
            </Link>
          </>
        )}
        {!description && (
          <Link
            href={productUrl}
            prefetch={false}
            className="mt-1 inline-block text-sm font-medium text-blue-600 group-hover:underline"
            aria-label={`More about ${title}`}
          >
            More
          </Link>
        )}

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

        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

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
