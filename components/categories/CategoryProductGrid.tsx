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
  label?: string;                // rare, but seen in some data
  description?: string;
  price?: number | string;
  currency?: string;             // e.g. "EUR"
  image?: string;
  gallery?: string[];            // extra thumbs
  buyUrl?: string;               // optional direct checkout
  href?: string;                 // explicit URL override
  type?: string;                 // e.g. "bundle"
  collection?: string;           // e.g. "bundles"
  category?: string;             // already present; can include "Bundle"
};

function formatPrice(p?: number | string, currency = "€") {
  if (typeof p === "number") {
    const num = p.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${num} ${currency}`;
  }
  return p ?? "";
}

/** Return slug or id string if available */
function slugOrId(p: GridProduct): string | null {
  if (p.slug && String(p.slug).trim()) return String(p.slug).trim();
  if (p.id !== undefined && p.id !== null) return String(p.id).trim();
  return null;
}

/** Decide if item belongs to the Bundles route */
function isBundleLike(p: GridProduct): boolean {
  const s = `${p.type ?? ""} ${p.collection ?? ""} ${p.category ?? ""}`.toLowerCase();
  return s.includes("bundle");
}

/** Compute the correct product URL:
 *  - prefer explicit p.href if provided
 *  - bundles → /bundles/[slug]
 *  - otherwise → /products/[slug]
 *  - if missing slug/id → fall back to /products
 */
function viewHrefFor(p: GridProduct): string {
  if (p.href) return p.href;
  const key = slugOrId(p);
  if (!key) return "/products";
  const base = isBundleLike(p) ? "/bundles" : "/products";
  return `${base}/${encodeURIComponent(key)}`;
}

async function buyNow(p: GridProduct) {
  // explicit checkout URL wins
  if (p.buyUrl) {
    window.location.href = p.buyUrl;
    return;
  }

  const viewHref = viewHrefFor(p);
  // try your Stripe endpoint
  try {
    const res = await fetch("/api/stripe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ slug: slugOrId(p) ?? "", quantity: 1 }], mode: "payment" }),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
  } catch {
    // ignore
  }

  // fallback to product page's buy section, or checkout if we don't have a key
  const key = slugOrId(p);
  if (key) window.location.href = `${viewHref}#buy`;
  else window.location.href = "/checkout";
}

function BlueButton(props: React.ComponentProps<"button">) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        "inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white " +
        "hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 " +
        "transition-colors " + className
      }
    />
  );
}

export default function CategoryProductGrid({ items }: { items: GridProduct[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p, i) => {
        const title = p.title ?? p.name ?? p.label ?? "Untitled";
        const priceLabel = formatPrice(p.price, p.currency ?? "€");
        const viewHref = viewHrefFor(p);
        const buyHref = p.buyUrl ?? `${viewHref}#buy`;

        // thumbs (limit to 3)
        const thumbs = useMemo(
          () => (Array.isArray(p.gallery) ? p.gallery.slice(0, 3) : []),
          [p.gallery]
        );

        const onAdd = () => {
          const key = slugOrId(p);
          if (!key) return;
          const numericPrice =
            typeof p.price === "number"
              ? p.price
              : Number(String(p.price ?? "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;

          addToCart({ id: key, title, price: numericPrice, image: p.image }, 1);
          // No redirect; CartBadge updates via event from lib/cart.ts
        };

        return (
          <article
            key={`${p.slug ?? p.id ?? i}`}
            className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Cover (hover zoom) */}
            <Link href={viewHref} className="block" aria-label={`View ${title}`}>
              <div className="aspect-[3/2] overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={p.image || "/images/placeholder.jpg"}
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

            {/* Mockups (hover ring) */}
            {thumbs.length > 0 && (
              <div className="mt-3 flex gap-3">
                {thumbs.map((src) => (
                  <div
                    key={src}
                    className="h-16 w-20 overflow-hidden rounded-lg border bg-white transition hover:ring-2 hover:ring-blue-400"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="mt-4 text-2xl font-semibold">{priceLabel}</div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={viewHref}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                👁️ View
              </Link>
              <BlueButton onClick={onAdd} disabled={!slugOrId(p)}>
                🛒 Add to cart
              </BlueButton>
              <Link
                href={buyHref}
                prefetch={false}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
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
