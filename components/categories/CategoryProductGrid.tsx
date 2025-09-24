"use client";

import Link from "next/link";
import AddToCartButton from "@/components/add-to-cart-button";
import { addToCart } from "@/lib/cart";

export type GridProduct = {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;
  label?: string;        // ← we will no longer use this as a title fallback
  description?: string;
  price?: number | string;
  currency?: string;
  image?: string;
  gallery?: string[];
  buyUrl?: string;
  href?: string;
  type?: string;
  collection?: string;
  category?: string;
  priceId?: string;
};

const titleCase = (s: string) =>
  s.replace(/[-_]+/g, " ")
   .replace(/\s+/g, " ")
   .trim()
   .replace(/\b\w/g, (m) => m.toUpperCase());

function titleFrom(p: GridProduct) {
  if (p.name && p.name.trim()) return p.name.trim();
  if (p.title && p.title.trim()) return p.title.trim();
  if (p.slug && String(p.slug).trim()) return titleCase(String(p.slug));
  if (p.id !== undefined && p.id !== null) return String(p.id);
  return "Untitled";
}

function formatPrice(p?: number | string, currency = "€") {
  if (typeof p === "number") {
    const num = p.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${num} ${currency}`;
  }
  return p ?? "";
}

function parsePrice(p?: number | string): number {
  if (typeof p === "number") return p;
  const s = String(p ?? "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function resolveNumericId(id?: string | number | null) {
  if (typeof id === "number") return id;
  if (typeof id === "string" && /^\d+$/.test(id)) return Number(id);
  return null;
}

function keyFor(p: GridProduct): string | null {
  if (p.id !== undefined && p.id !== null && String(p.id).trim() !== "") return String(p.id).trim();
  if (p.slug && String(p.slug).trim() !== "") return String(p.slug).trim();
  return null;
}
function cartKeyFor(p: GridProduct, i: number): string {
  const k = keyFor(p);
  if (k) return k;
  const base = titleFrom(p)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${i}`;
}

function isBundleLike(p: GridProduct) {
  const s = `${p.type ?? ""} ${p.collection ?? ""} ${p.category ?? ""}`.toLowerCase();
  return s.includes("bundle");
}

function viewHrefFor(p: GridProduct): string {
  if (p.href) return p.href;
  const idStr = p.id !== undefined && p.id !== null ? String(p.id).trim() : null;
  const slugStr = p.slug && String(p.slug).trim() !== "" ? String(p.slug).trim() : null;

  if (isBundleLike(p)) {
    if (slugStr) return `/bundles/${encodeURIComponent(slugStr)}`;
    if (idStr) return `/bundles/${encodeURIComponent(idStr)}`;
    return "/bundles";
  }

  if (idStr && /^\d+$/.test(idStr)) return `/products/${idStr}`;
  if (slugStr) return `/products/${encodeURIComponent(slugStr)}`;
  if (idStr) return `/products/${encodeURIComponent(idStr)}`;
  return "/products";
}

async function buyNow(p: GridProduct) {
  const idNum = resolveNumericId(p.id);
  if (idNum) {
    window.location.href = `/api/checkout?productId=${idNum}&qty=1`;
    return;
  }
  try {
    const productKey = keyFor(p);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        p.priceId
          ? { line_items: [{ price: p.priceId, quantity: 1 }], mode: "payment" }
          : { items: [{ slug: productKey, quantity: 1 }], mode: "payment" }
      ),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
  } catch { /* ignore */ }
  window.location.href = "/checkout";
}

function BlueLink(props: React.ComponentProps<typeof Link>) {
  const { className = "", ...rest } = props;
  return (
    <Link
      {...rest}
      className={
        "inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white " +
        "transition-colors hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 " +
        className
      }
    />
  );
}
function BlueButton(props: React.ComponentProps<"button">) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={
        "inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white " +
        "transition-colors hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 " +
        className
      }
    />
  );
}

export default function CategoryProductGrid({ items }: { items: GridProduct[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p, i) => {
        const title = titleFrom(p);             // ✅ never use subcategory label here
        const priceLabel = formatPrice(p.price, p.currency ?? "€");
        const viewHref = viewHrefFor(p);
        const idNum = resolveNumericId(p.id);
        const thumbs = Array.isArray(p.gallery) ? p.gallery.slice(0, 3) : [];

        const onAddFallback = () => {
          const key = cartKeyFor(p, i);
          addToCart({ id: key, title, price: parsePrice(p.price), image: p.image }, 1);
          // extra event for any legacy listeners
          window.dispatchEvent(new CustomEvent("cart-change", { detail: { count: 1 } }));
        };

        return (
          <article
            key={`${p.slug ?? p.id ?? i}`}
            className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
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

            <h3 className="mt-3 text-xl font-semibold leading-snug">
              <Link href={viewHref} className="hover:underline">{title}</Link>
            </h3>

            {p.description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.description}</p>
            )}

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

            <div className="mt-4 text-2xl font-semibold">{priceLabel}</div>

            <div className="mt-4 flex flex-wrap gap-3">
              <BlueLink href={viewHref}>👁️ View</BlueLink>

              {idNum !== null ? (
                <AddToCartButton
                  productId={idNum}
                  className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              ) : (
                <BlueButton onClick={onAddFallback}>🛒 Add to cart</BlueButton>
              )}

              {idNum !== null ? (
                <BlueLink href={`/api/checkout?productId=${idNum}&qty=1`}>⚡ Buy</BlueLink>
              ) : (
                <BlueButton onClick={() => buyNow(p)}>⚡ Buy</BlueButton>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
