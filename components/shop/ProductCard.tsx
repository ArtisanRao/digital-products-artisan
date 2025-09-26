"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as cart from "@/lib/cart";

export type ProductCardData = {
  title: string;
  slug?: string;
  id?: string | number;
  price?: number | string;
  images?: string[];      // cover first, then mockups
  href?: string;          // explicit product url; if given, we use it
  description?: string;
};

const MAX_THUMBS = 3; // <= only 3 extra images

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

  // full list provided to the card (cover first)
  const picsAll = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );

  // we render only the cover + 3 extras
  const displayPics = useMemo(() => {
    const cover = picsAll[0] ?? "/images/placeholder.jpg";
    const extras = picsAll.slice(1, 1 + MAX_THUMBS);
    return [cover, ...extras].filter(Boolean);
  }, [picsAll]);

  // index inside displayPics
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(0); // persisted selection

  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? displayPics.length - 1 : i - 1)),
    [displayPics.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i + 1) % displayPics.length),
    [displayPics.length]
  );

  // keyboard arrows on the hero image
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const numericPrice =
    typeof price === "number" ? price : Number(String(price ?? "").replace(/[^\d.-]+/g, "")) || 0;

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  const productHref =
    href ??
    (id !== undefined ? `/products/${id}` : slug ? `/products/${slug}` : "/products");

  /* ---------------- Cart + badge (uses lib/cart) ---------------- */
  const bridgeCartUpdatedEvent = () => {
    try {
      const items = cart.getCart();
      const count = cart.getCartCount();
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
      localStorage.setItem("cartCount", String(count));
    } catch {
      /* no-op */
    }
  };

  const addToCart = () => {
    try {
      const key = String(id ?? slug ?? "");
      cart.addToCart(
        { id: key, title, price: numericPrice, image: displayPics[0] },
        1
      );
      bridgeCartUpdatedEvent();
    } catch (e) {
      console.error("addToCart error", e);
    }
  };

  /* ---------------- Buy → Checkout ---------------- */
  const buyNow = async () => {
    const key = String(slug ?? id ?? "");
    try {
      addToCart(); // ensure badge updates immediately

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          slug
            ? { items: [{ slug: key, quantity: 1 }] }
            : { productId: String(id ?? ""), qty: 1 }
        ),
      });

      if (res.ok) {
        const data = await res.json();
        const url = data?.url || data?.checkoutUrl || data?.redirectUrl;
        if (url) {
          window.location.href = url;
          return;
        }
      }
      router.push(`/checkout?product=${encodeURIComponent(key)}`);
    } catch (e) {
      console.error("buyNow error", e);
      router.push(`/checkout?product=${encodeURIComponent(key)}`);
    }
  };

  return (
    <article className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Main image (clickable) */}
      <Link href={productHref} aria-label={`Open ${title}`} className="block">
        <div
          className="relative overflow-hidden rounded-t-2xl bg-gray-50 outline-none"
          tabIndex={0}
          aria-roledescription="image carousel"
        >
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
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
              >
                ›
              </button>
            </>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Title */}
        <Link
          href={productHref}
          className="block hover:underline hover:decoration-2 hover:underline-offset-4"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbs → exactly 3 extras, hover = temporary, click = persist; red highlight when selected */}
        {displayPics.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {displayPics.slice(1).map((src, tIndex) => {
              const absoluteIndex = tIndex + 1; // because thumbs start at second image
              const isActive = idx === absoluteIndex;
              return (
                <button
                  key={src + tIndex}
                  type="button"
                  onMouseEnter={() => setIdx(absoluteIndex)}      // temporary preview
                  onMouseLeave={() => setIdx(selected)}            // revert to persisted
                  onClick={() => { setSelected(absoluteIndex); setIdx(absoluteIndex); }}
                  className={[
                    "h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition",
                    "hover:opacity-100",
                    isActive
                      ? "ring-2 ring-red-500 border-red-500"
                      : "opacity-90 hover:ring-1 hover:ring-red-300"
                  ].join(" ")}
                  aria-label={`Preview image ${absoluteIndex}`}
                  title="Click to select"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              );
            })}
          </div>
        )}

        {/* Price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* Actions – SMALL, single row, no wrapping */}
        <div className="mt-3 flex flex-nowrap items-center gap-2">
          <Link
            href={productHref}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-2.5 text-xs font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label={`View ${title}`}
          >
            <span className="mr-1">👁️</span> <span>View</span>
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-2.5 text-xs font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Add to cart"
          >
            <span className="mr-1">🛒</span> <span>Add to cart</span>
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-2.5 text-xs font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Buy now"
          >
            <span className="mr-1">⚡</span> <span>Buy</span>
          </button>
        </div>
      </div>
    </article>
  );
}
