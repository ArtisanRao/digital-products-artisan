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

  // 1) Build picture list (deduped), with cover first (and included as a thumbnail).
  const pics = useMemo(() => {
    const base = images.length ? images : ["/images/placeholder.jpg"];
    // Dedupe while preserving order
    const seen = new Set<string>();
    const dedup = base.filter((u) => {
      if (!u) return false;
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });
    return dedup;
  }, [images]);

  // 2) Thumbnail list: include main (index 0) and cap to 3 total.
  const thumbs = useMemo(() => pics.slice(0, 3), [pics]);

  // State: selected (persistent) and hovering (temporary)
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Clamp if images change
  useEffect(() => {
    if (selectedIdx >= pics.length) setSelectedIdx(0);
  }, [pics, selectedIdx]);

  const displayIdx = hoverIdx ?? selectedIdx;

  // Prev/Next for keyboard arrows
  const prev = useCallback(() => {
    setSelectedIdx((i) => (i - 1 + pics.length) % pics.length);
  }, [pics.length]);

  const next = useCallback(() => {
    setSelectedIdx((i) => (i + 1) % pics.length);
  }, [pics.length]);

  // Keyboard navigation when the card is focused
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // Prefer numeric/string ID route (SSG), then slug
  const productHref =
    href ??
    (id !== undefined ? `/products/${id}` : slug ? `/products/${slug}` : "/products");

  const numericPrice =
    typeof price === "number" ? price : Number(String(price ?? "").replace(/[^\d.-]+/g, "")) || 0;

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

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
        {
          id: key,
          title,
          price: numericPrice,
          image: pics[0],
        },
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
      addToCart();
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
    <article
      className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500/30"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Main image (clickable) */}
      <Link href={productHref} aria-label={`Open ${title}`} className="block">
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pics[displayIdx]}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
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
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbs – include main as first, MAX 3; hover = temp preview, click = persist */}
        {thumbs.length > 0 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {thumbs.map((src, i) => {
              const isSelected = i === selectedIdx; // selected persists
              return (
                <button
                  key={src + i}
                  type="button"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
                  onFocus={() => setHoverIdx(i)}
                  onBlur={() => setHoverIdx(null)}
                  onClick={() => {
                    setSelectedIdx(i);
                    setHoverIdx(null);
                  }}
                  className={[
                    "h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white",
                    "opacity-90 transition hover:opacity-100",
                    isSelected ? "ring-2 ring-red-500" : "hover:ring-2 hover:ring-red-300",
                  ].join(" ")}
                  aria-label={`Preview image ${i + 1}`}
                  title={`Preview image ${i + 1}`}
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
