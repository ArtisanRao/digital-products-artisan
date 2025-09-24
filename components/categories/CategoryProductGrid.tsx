// components/category/CategoryProductGrid.tsx
"use client";

import Link from "next/link";
import { add } from "@/lib/cart";

export type GridProduct = {
  slug: string;
  title: string;
  category: string;
  price: number | string;
  image?: string;         // cover
  gallery?: string[];     // mockups
  description?: string;
  priceId?: string;       // if you use Stripe Checkout
  buyUrl?: string;        // optional direct checkout url
};

function fmtPrice(p: number | string) {
  if (typeof p === "number") {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(p); }
    catch { return `€${p.toFixed(2)}`; }
  }
  return p;
}

async function buyNow(p: GridProduct) {
  // 1) use provided checkout url if present
  if (p.buyUrl) { window.location.href = p.buyUrl; return; }

  // 2) try your Stripe endpoint (/api/stripe/create exists in your project)
  try {
    const res = await fetch("/api/stripe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        p.priceId
          ? { line_items: [{ price: p.priceId, quantity: 1 }], mode: "payment" }
          : { items: [{ slug: p.slug, quantity: 1 }], mode: "payment" }
      ),
    });
    const data = await res.json();
    if (data?.url) { window.location.href = data.url; return; }
  } catch {}
  // 3) fallback to product page
  window.location.href = `/products/${p.slug}#buy`;
}

function AddToCart({ p }: { p: GridProduct }) {
  return (
    <button
      onClick={() => {
        const price = typeof p.price === "number" ? p.price : Number(String(p.price).replace(/[^\d.]/g, "")) || 0;
        add({ slug: p.slug, title: p.title, price, image: p.image }, 1);
      }}
      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
    >
      🛒 Add to cart
    </button>
  );
}

function BuyButton({ p }: { p: GridProduct }) {
  return (
    <button
      onClick={() => buyNow(p)}
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      ⚡ Buy
    </button>
  );
}

export default function CategoryProductGrid({ items }: { items: GridProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((p) => {
        const thumbs = (p.gallery ?? []).slice(0, 3);
        return (
          <article key={p.slug} className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition">
            <Link href={`/products/${p.slug}`} className="block">
              <div className="aspect-[3/2] rounded-xl bg-gray-50 overflow-hidden">
                <img
                  src={p.image ?? "/images/placeholder.jpg"}
                  alt={p.title}
                  className="h-full w-full object-contain p-3"
                  loading="lazy"
                />
              </div>
            </Link>

            <h3 className="mt-3 text-xl font-semibold">
              <Link href={`/products/${p.slug}`} className="hover:underline">
                {p.title}
              </Link>
            </h3>
            {p.description && <p className="mt-1 text-gray-600 line-clamp-2">{p.description}</p>}

            {thumbs.length > 0 && (
              <div className="mt-3 flex gap-3">
                {thumbs.map((src) => (
                  <div key={src} className="h-16 w-20 rounded-lg border bg-white overflow-hidden">
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-2xl font-semibold">{fmtPrice(p.price)}</div>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/products/${p.slug}`}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-muted/30"
              >
                👁️ View
              </Link>
              <AddToCart p={p} />
              <BuyButton p={p} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
