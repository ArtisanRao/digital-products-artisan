"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
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

  // Limit to: 1 cover + 3 extra thumbs (max 4 total)
  const allPics = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );
  const pics = useMemo(() => allPics.slice(0, 4), [allPics]); // enforce max 4
  const thumbs = useMemo(() => pics.slice(1, 4), [pics]);

  // Index management: selected (persistent), hover (temporary)
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const viewIdx = hoverIdx ?? selectedIdx;

  // Keyboard navigation (← →) when the card is focused
  const cardRef = useRef<HTMLDivElement | null>(null);
  const goPrev = useCallback(() => {
    setSelectedIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  }, [pics.length]);
  const goNext = useCallback(() => {
    setSelectedIdx((i) => (i + 1) % pics.length);
  }, [pics.length]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape" && lightboxOpen) {
        e.preventDefault();
        setLightboxOpen(false);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]); // lightboxOpen handled in separate effect

  // Lightbox zoom
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Close lightbox on Escape (global)
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

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
      ref={cardRef}
      tabIndex={0}
      className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
    >
      {/* Main preview (click = lightbox, hover = subtle scale; no navigation here) */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pics[viewIdx]}
          alt={title}
          className="aspect-[3/2] w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
          onClick={() => setLightboxOpen(true)}
          role="button"
          aria-label={`Zoom ${title}`}
        />

        {/* Prev / Next chevrons (stay) */}
        {pics.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); goPrev(); }}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); goNext(); }}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow hover:bg-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        {/* Title links to the product page */}
        <Link
          href={productHref}
          className="block hover:underline hover:decoration-2 hover:underline-offset-4"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* Thumbnails: only 3, hover = temporary preview, click = select */}
        {thumbs.length > 0 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {thumbs.map((src, i) => {
              const idx = i + 1; // actual index in `pics`
              const isSelected = selectedIdx === idx;
              const isHovered = hoverIdx === idx;
              return (
                <button
                  key={src + idx}
                  type="button"
                  onMouseEnter={() => setHoverIdx(idx)}
                  onMouseLeave={() => setHoverIdx((h) => (h === idx ? null : h))}
                  onClick={() => setSelectedIdx(idx)}
                  className={[
                    "h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition",
                    "hover:opacity-100",
                    isSelected
                      ? "ring-2 ring-blue-500 border-blue-400"
                      : isHovered
                      ? "ring-1 ring-blue-300 border-blue-200"
                      : "opacity-90",
                  ].join(" ")}
                  aria-label={`Preview image ${idx + 1}`}
                  title="Click to select • Hover to preview"
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pics[selectedIdx]}
              alt={title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
            >
              ✕
            </button>
            {pics.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow hover:bg-white"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
