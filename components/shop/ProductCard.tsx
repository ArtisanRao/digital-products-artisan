"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

  const pics = useMemo(
    () => (images.length ? images : ["/images/placeholder.jpg"]),
    [images]
  );
  const [idx, setIdx] = useState(0);

  // Prefer numeric/string ID route (SSG), then slug
  const productHref =
    href ??
    (id !== undefined ? `/products/${id}` : slug ? `/products/${slug}` : "/products");

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);

  const numericPrice =
    typeof price === "number" ? price : Number(String(price).replace(/[^\d.-]+/g, "")) || 0;

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  /* ---------------- Cart + badge (uses lib/cart) ---------------- */
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
      // lib/cart emits cart-update + legacy events; badge updates automatically
    } catch (e) {
      console.error("addToCart error", e);
    }
  };

  /* ---------------- Buy → Checkout ---------------- */
  const buyNow = async () => {
    // Use whichever identifier you have; API accepts slug OR productId
    const payload =
      slug != null
        ? { slug, qty: 1 }
        : { productId: String(id ?? ""), qty: 1 };

    try {
      // Ensure item exists (optional, keeps flows consistent)
      addToCart();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          "slug" in payload
            ? { items: [{ slug: payload.slug, quantity: payload.qty }] }
            : { productId: payload.productId, qty: payload.qty }
        ),
      });

      if (res.ok) {
        const data = await res.json();
        const url = data?.url || data?.checkoutUrl || data?.redirectUrl;
        if (url) {
          window.location.href = url; // Stripe Checkout (or your gateway)
          return;
        }
      }

      // Fallback: local checkout page with product param
      const key = encodeURIComponent(String(slug ?? id ?? ""));
      router.push(`/checkout?product=${key}`);
    } catch {
      const key = encodeURIComponent(String(slug ?? id ?? ""));
      router.push(`/checkout?product=${key}`);
    }
  };

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
