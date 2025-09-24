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
  label?: string;                // rare
  description?: string;
  price?: number | string;
  currency?: string;             // e.g. "EUR"
  image?: string;
  gallery?: string[];            // extra thumbs
  buyUrl?: string;               // direct checkout
  href?: string;                 // explicit URL override
  type?: string;                 // e.g. "bundle"
  collection?: string;           // e.g. "bundles"
  category?: string;             // may contain "Bundle"
};

/** Format like “9,99 €” */
function formatPrice(p?: number | string, currency = "€") {
  if (typeof p === "number") {
    const num = p.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${num} ${currency}`;
  }
  return p ?? "";
}

/** Prefer numeric id (since /products/[id] is SSG), else slug, else null */
function keyFor(p: GridProduct): string | null {
  if (p.id !== undefined && p.id !== null && String(p.id).trim() !== "") return String(p.id).trim();
  if (p.slug && String(p.slug).trim() !== "") return String(p.slug).trim();
  return null;
}

function isBundleLike(p: GridProduct): boolean {
  const s = `${p.type ?? ""} ${p.collection ?? ""} ${p.category ?? ""}`.toLowerCase();
  return s.includes("bundle");
}

/** Compute a safe view URL for this product:
 * 1) explicit p.href wins
 * 2) bundles → /bundles/[slug] (prefer slug for bundles)
 * 3) products → /products/[id] if numeric id exists; else /products/[slug]
 * 4) otherwise /products (no 404)
 */
function viewHrefFor(p: GridProduct): string {
  if (p.href) return p.href;

  const idStr = p.id !== undefined && p.id !== null ? String(p.id).trim() : null;
  const slugStr = p.slug && String(p.slug).trim() !== "" ? String(p.slug).trim() : null;

  if (isBundleLike(p)) {
    // bundles are usually slug-based routes
    if (slugStr) return `/bundles/${encodeURIComponent(slugStr)}`;
    if (idStr) return `/bundles/${encodeURIComponent(idStr)}`;
    return "/bundles";
  }

  // products: prefer numeric id route (SSG), else slug
  if (idStr && /^\d+$/.test(idStr)) return `/products/${idStr}`;
  if (slugStr) return `/products/${encodeURIComponent(slugStr)}`;
  if (idStr) return `/products/${encodeURIComponent(idStr)}`;

  return "/products";
}

async function buyNow(p: GridProduct) {
  // 1) explicit checkout url
  if (p.buyUrl) {
    window.location.href = p.buyUrl;
    return;
  }

  // 2) Stripe endpoint (if configured)
  try {
    const key = keyFor(p) ?? "";
    const res = await fetch("/api/stripe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ slug: key, quantity: 1 }], mode: "payment" }),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
  } catch {
    // ignore and fallback below
  }

  // 3) fallback: product page #buy, final fallback: /checkout
  const v = viewHrefFor(p);
  if (v && v !== "/products" && v !== "/bundles") {
    window.location.href = `${v}#buy`;
  } else {
    window.location.href = "/checkout";
  }
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
        const thumbs = useMemo(
          () => (Array.isArray(p.gallery) ? p.gallery.slice(0, 3) : []),
          [p.gallery]
        );

        const onAdd = () => {
          const key = keyFor(p);
          if (!key) return; // no route-able key; avoid side-effects
          const numericPrice =
            typeof p.price === "number"
              ? p.price
              : Number(String(p.price ?? "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;

          addToCart({ id: key, title, price: numericPrice, image: p.image }, 1);
          // no redirect; CartBadge updates via event in lib/cart.ts
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
              <BlueButton onClick={onAdd} disabled={!keyFor(p)}>
                🛒 Add to cart
              </BlueButton>
              <BlueButton onClick={() => buyNow(p)}>
                ⚡ Buy
              </BlueButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}
