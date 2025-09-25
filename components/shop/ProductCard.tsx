"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const pics = useMemo(() => (images.length ? images : ["/images/placeholder.jpg"]), [images]);
  const [idx, setIdx] = useState(0);

  const productHref =
    href ?? (id !== undefined ? `/products/${id}` : slug ? `/products/${slug}` : "/products");

  const prev = () => setIdx((i) => (i === 0 ? pics.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % pics.length);

  const priceLabel =
    typeof price === "number"
      ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price)
      : (price ?? "");

  // Cart + badge
  const addToCart = () => {
    try {
      const w = window as any;
      const keyName = String(id ?? slug ?? "");

      if (w?.dpaCart?.add) w.dpaCart.add({ id: id ?? slug, qty: 1 });
      else if (w?.__CART__?.add) w.__CART__.add({ id: id ?? slug, qty: 1 });
      else {
        const raw = localStorage.getItem("cart");
        const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
        cart[keyName] = (cart[keyName] ?? 0) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      const raw2 = localStorage.getItem("cart");
      const total = raw2
        ? Object.values(JSON.parse(raw2) as Record<string, number>).reduce((a, b) => a + Number(b), 0)
        : 0;
      window.dispatchEvent(new CustomEvent("cart:add", { detail: { id: id ?? slug, qty: 1 } }));
      window.dispatchEvent(new CustomEvent("cart:count", { detail: total }));
    } catch (e) {
      console.error("addToCart error", e);
    }
  };

  // Buy → Stripe session (fall back to /checkout)
  const buyNow = async () => {
    const keyName = String(slug ?? id ?? "");
    try {
      addToCart();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ slug: keyName, quantity: 1 }] }), // matches your API
      });
      if (res.ok) {
        const data = await res.json();
        const url = data?.url || data?.checkoutUrl || data?.redirectUrl;
        if (url) {
          window.location.href = url;
          return;
        }
      }
      router.push(`/checkout?product=${encodeURIComponent(keyName)}`);
    } catch {
      router.push(`/checkout?product=${encodeURIComponent(keyName)}`);
    }
  };

  return (
    <article className="group rounded-2xl border bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* hero */}
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
                onClick={(e) => { e.preventDefault(); prev(); }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); next(); }}
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
        {/* title */}
        <Link
          href={productHref}
          className="block hover:underline hover:decoration-2 hover:underline-offset-4"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
        )}

        {/* thumbs */}
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

        {/* price */}
        {priceLabel && <div className="mt-3 text-xl font-semibold">{priceLabel}</div>}

        {/* actions – compact, one line, content width */}
        <div className="mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto">
          <Link
            href={productHref}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-3 text-[13px] font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label={`View ${title}`}
          >
            👁️ View
          </Link>

          <button
            type="button"
            onClick={addToCart}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-3 text-[13px] font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Add to cart"
          >
            🛒 Add to cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-3 text-[13px] font-medium leading-none text-white hover:bg-blue-700 whitespace-nowrap"
            aria-label="Buy now"
          >
            ⚡ Buy
          </button>
        </div>
      </div>
    </article>
  );
}
