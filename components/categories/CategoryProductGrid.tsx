"use client";

import Link from "next/link";
import { useMemo } from "react";
import { addToCart } from "@/lib/cart";

/** Minimal shape we consume from /data/products */
export type GridProduct = {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;                 // some datasets use `name`
  description?: string;
  price?: number | string;
  currency?: string;             // e.g. "EUR"
  image?: string;
  gallery?: string[];            // extra thumbs
  buyUrl?: string;               // optional direct checkout
};

/** Format “9,99 €” to match your site’s style */
function formatPrice(p?: number | string, currency = "€") {
  if (typeof p === "number") {
    // produce: 9,99 €
    const num = p.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${num} ${currency}`;
  }
  return p ?? "";
}

/** Prefer slug route, else numeric id route, else fall back */
function productPath(p: GridProduct) {
  if (p.slug) return `/products/${p.slug}`;
  if (p.id !== undefined && p.id !== null) return `/products/${String(p.id)}`;
  return "#";
}

/** Card */
export default function CategoryProductGrid({ items }: { items: GridProduct[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p, i) => {
        const title = p.title ?? p.name ?? "Untitled";
        const priceLabel = formatPrice(p.price, p.currency ?? "€");
        const viewHref = productPath(p);
        const buyHref = p.buyUrl ?? (viewHref === "#" ? "#" : `${viewHref}#buy`);

        // thumbs (limit to 3)
        const thumbs = useMemo(() => (Array.isArray(p.gallery) ? p.gallery.slice(0, 3) : []), [p.gallery]);

        const onAdd = () => {
          if (viewHref === "#") return;
          // use slug if present, else id
          const key = p.slug ?? String(p.id ?? "");
          addToCart(
            {
              id: key,
              title,
              price: typeof p.price === "number" ? p.price : Number(String(p.price).replace(",", ".")) || 0,
              image: p.image,
            },
            1
          );
        };

        return (
          <article
            key={`${p.slug ?? p.id ?? i}`}
            className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Cover */}
            <Link href={viewHref} className="block" aria-label={`View ${title}`}>
              <div className="aspect-[3/2] overflow-hidden rounded-xl bg-gray-50">
                {/* object-contain so covers aren’t cropped; subtle hover zoom */}
                <img
                  src={p.image}
                  alt={title}
                  className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Title */}
            <h3 className="mt-3 text-xl font-semibold leading-snug">
              <Link href={viewHref} className="hover:underline">
                {title}
              </Link>
            </h3>

            {/* Optional blurb */}
            {p.description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.description}</p>
            )}

            {/* Thumbs */}
            {thumbs.length > 0 && (
              <div className="mt-3 flex gap-3">
                {thumbs.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-16 w-16 rounded-lg border bg-white object-cover transition duration-300 hover:scale-[1.04] hover:shadow"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Price + actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-2xl font-semibold">{priceLabel}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {/* View (blue button, same style as Products page) */}
              <Link
                href={viewHref}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                👁️ View
              </Link>

              {/* Add to cart (no redirect, updates badge) */}
              <button
                type="button"
                onClick={onAdd}
                disabled={viewHref === "#"}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                aria-label={`Add ${title} to cart`}
              >
                🛒 Add to cart
              </button>

              {/* Buy → go to product page’s buy section (works even without direct API) */}
              <Link
                href={buyHref}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                ⚡ Buy
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
