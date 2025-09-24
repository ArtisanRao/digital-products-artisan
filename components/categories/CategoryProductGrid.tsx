"use client";

import Link from "next/link";
import { add } from "@/lib/cart";

export type GridProduct = {
  id?: string | number;
  slug?: string;
  title: string;          // ← real product title
  category: string;
  price: number | string;
  image?: string;         // cover
  gallery?: string[];     // mockups (first 3 shown)
  description?: string;
  priceId?: string;       // if you use Stripe Checkout
  buyUrl?: string;        // optional direct checkout URL
};

function fmtPrice(p: number | string) {
  if (typeof p === "number") {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(p);
    } catch {
      return `€${p.toFixed(2)}`;
    }
  }
  return p;
}

function productUrl(p: GridProduct) {
  if (p.slug) return `/products/${p.slug}`;
  if (p.id !== undefined) return `/products/${p.id}`;
  return `/products`;
}

async function buyNow(p: GridProduct) {
  if (p.buyUrl) {
    window.location.href = p.buyUrl;
    return;
  }
  try {
    const res = await fetch("/api/stripe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        p.priceId
          ? { line_items: [{ price: p.priceId, quantity: 1 }], mode: "payment" }
          : { items: [{ slug: p.slug ?? String(p.id), quantity: 1 }], mode: "payment" }
      ),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
  } catch {}
  // Fallback
  window.location.href = `/checkout?item=${encodeURIComponent(p.slug ?? String(p.id ?? ""))}`;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((p) => {
        const thumbs = (p.gallery ?? []).slice(0, 3);

        const onAdd = () => {
          const price =
            typeof p.price === "number"
              ? p.price
              : Number(String(p.price).replace(/[^\d.]/g, "")) || 0;
          add({ slug: p.slug ?? String(p.id ?? ""), title: p.title, price, image: p.image }, 1);
          // No redirect; CartBadge will update via cart change event.
        };

        const onBuy = () => buyNow(p);

        return (
          <article
            key={p.slug ?? String(p.id ?? Math.random())}
            className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Cover (hover zoom) */}
            <Link href={productUrl(p)} className="group block">
              <div className="aspect-[3/2] rounded-xl bg-gray-50 overflow-hidden">
                <img
                  src={p.image ?? "/images/placeholder.jpg"}
                  alt={p.title}
                  className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Title + description (uses real product title) */}
            <h3 className="mt-3 text-xl font-semibold">
              <Link href={productUrl(p)} className="hover:underline">{p.title}</Link>
            </h3>
            {p.description && (
              <p className="mt-1 text-gray-600 line-clamp-2">{p.description}</p>
            )}

            {/* Mockups (hover ring) */}
            {thumbs.length > 0 && (
              <div className="mt-3 flex gap-3">
                {thumbs.map((src) => (
                  <div
                    key={src}
                    className="h-16 w-20 rounded-lg border bg-white overflow-hidden hover:ring-2 hover:ring-blue-400 transition"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="mt-4 text-2xl font-semibold">{fmtPrice(p.price)}</div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={productUrl(p)}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-colors"
              >
                👁️ View
              </Link>

              <BlueButton onClick={onAdd}>🛒 Add to cart</BlueButton>
              <BlueButton onClick={onBuy}>⚡ Buy</BlueButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}
