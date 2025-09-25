"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProductCardData = {
  title: string;
  slug: string;
  price?: number | string;
  images?: string[]; // cover first, then mockups
  href?: string;     // defaults to `/products/<slug>`
  description?: string;
};

export default function ProductCard({
  title,
  slug,
  price,
  images = [],
  href = `/products/${slug}`,
  description,
}: ProductCardData) {
  const pics = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);
  const go = (i: number) => setIdx(i);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  return (
    <article className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Image area */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={pics[idx]}
          alt={title}
          className="aspect-[3/2] w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Prev/Next on hover */}
        {pics.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        <Link href={href} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbs */}
        {pics.length > 1 && (
          <div className="mt-3 flex items-center gap-2">
            {pics.slice(0, 3).map((src, i) => (
              <button
                key={src + i}
                onClick={() => go(i)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                  idx === i ? "ring-2 ring-blue-500" : "opacity-80 hover:opacity-100"
                }`}
                aria-label={`Preview ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={href}
            className="flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            👁️ View
          </Link>

          {/* These two can be wired to your cart/checkout later; for now, send to product page anchors */}
          <Link
            href={`${href}#add-to-cart`}
            className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            🛒 Add to cart
          </Link>

          <Link
            href={`${href}#buy`}
            className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ⚡ Buy
          </Link>
        </div>
      </div>
    </article>
  );
}
