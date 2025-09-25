"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type ProductCardData = {
  title: string;
  slug?: string;
  id?: string | number;
  price?: number | string;
  images?: string[];   // cover first, then mockups
  href?: string;       // explicit product url; if given, we use it
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
  const router = useRouter();

  const pics = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );
  const [idx, setIdx] = useState(0);

  // Prefer ID route (SSG), then slug
  const productHref =
    href ??
    (id !== undefined
      ? `/products/${id}`
      : slug
      ? `/products/${slug}`
      : "/products");

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(price)
      : price ?? "";

  /* ---------------------- Cart / Badge wiring ---------------------- */
  const addToCart = () => {
    try {
      const w = window as any;
      const keyName = String(id ?? slug ?? "");

      if (w?.dpaCart?.add) {
        w.dpaCart.add({ id: id ?? slug, qty: 1 });
      } else if (w?.__CART__?.add) {
        w.__CART__.add({ id: id ?? slug, qty: 1 });
      } else {
        const raw = localStorage.getItem("cart");
        const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
        cart[keyName] = (cart[keyName] ?? 0) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Update badge
      const raw2 = localStorage.getItem("cart");
      const total = raw2
        ? Object.values(JSON.parse(raw2) as Record<string, number>).reduce(
            (a, b) => a + Number(b),
            0
          )
        : 0;
      window.dispatchEvent(
        new CustomEvent("cart:add", { detail: { id: id ?? slug, qty: 1 } })
      );
      window.dispatchEvent(new CustomEvent("cart:count", { detail: total }));
    } catch (e) {
      console.error("addToCart error", e);
    }
  };

  /* ---------------- Buy: create checkout session + fallback -------- */
  const buyNow = async () => {
    const keyName = String(id ?? slug ?? "");

    try {
      // ensure it's in cart (optional but keeps downstream flows happy)
      addToCart();

      // POST – Case 1 supported by /api/checkout (productId OR slug)
      const payload =
        slug !== undefined ? { slug, qty: 1 } : { productId: id, qty: 1 };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const url = data?.url || data?.checkoutUrl || data?.redirectUrl;
        if (url) {
          window.location.href = url;
          return;
        }
      }

      // Fallback to GET (303 redirect from the API)
      const u = new URL("/api/checkout", window.location.origin);
      if (slug !== undefined) u.searchParams.set("slug", slug);
      else if (id !== undefined) u.searchParams.set("productId", String(id));
      window.location.href = u.toString();
    } catch (err) {
      console.error("buyNow error", err);
      const u = new URL("/api/checkout", window.location.origin);
      if (slug !== undefined) u.searchParams.set("slug", slug);
      else if (id !== undefined) u.searchParams.set("productId", String(id));
      window.location.href = u.toString();
    }
  };
  /* ----------------------------------------------------------------- */

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
                onClick={(e) => {
                  e.preventDefault();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
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
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>
        )}

        {/* Thumbs → each opens the product page */}
        {pics.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {pics.map((src, i) => (
              <Link
                key={src + i}
                href={productHref}
                className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white opacity-90 transition hover:opacity-100"
                aria-label={`Open ${title}`}
                title={`Open ${title}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </Link>
            ))}
          </div>
        )}

        {/* Price */}
        {priceLabel && (
          <div className="mt-3 text-xl font-semibold">{priceLabel}</div>
        )}

        {/* Actions: single row, compact so "Add to cart" never wraps */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Link
            href={productHref}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2
                       text-[12px] sm:text-[13px] font-medium text-white whitespace-nowrap hover:bg-blue-700"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2
                       text-[12px] sm:text-[13px] font-medium text-white whitespace-nowrap hover:bg-blue-700"
            aria-label="Add to cart"
          >
            🛒 Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2
                       text-[12px] sm:text-[13px] font-medium text-white whitespace-nowrap hover:bg-blue-700"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
