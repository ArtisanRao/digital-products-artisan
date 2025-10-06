"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

// ⬇️ single source of truth
import { products, productsBySlug, productsById, type Product } from "@/data/products";

type Item = {
  id: string;            // can be slug or numeric id (stringified)
  title: string;
  image: string;
  price: number | string; // may be ignored if catalog has a match
  description: string;
};

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

/** quick slugify for lookups when id looks like a title */
function toSlug(s: string) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Try to resolve incoming card data to a catalog product (by slug, numeric id, or title). */
function resolveCatalog(p: Item): Product | undefined {
  const key = (p.id ?? "").toString().trim();
  if (key) {
    if (/[a-zA-Z]/.test(key)) {
      // looks like a slug or title
      const slug = key.includes("-") ? key : toSlug(key);
      if (productsBySlug[slug]) return productsBySlug[slug];
    } else {
      // numeric id (string)
      const n = parseInt(key, 10);
      if (!Number.isNaN(n) && productsById[n]) return productsById[n];
    }
  }
  // fallback: try by normalized title if provided
  if (p.title) {
    const maybe = products.find(pr => pr.title.toLowerCase() === p.title.toLowerCase());
    if (maybe) return maybe;
  }
  return undefined;
}

/** After Add to Cart, go to /cart so the badge is visible */
function CartAutoRedirect() {
  const router = useRouter();
  useEffect(() => {
    const toCart = () => router.push("/cart");
    document.addEventListener("snipcart.item.added", toCart as EventListener);
    document.addEventListener("cart:item-added", toCart as EventListener);
    return () => {
      document.removeEventListener("snipcart.item.added", toCart as EventListener);
      document.removeEventListener("cart:item-added", toCart as EventListener);
    };
  }, [router]);
  return null;
}

function BestSellerCard({ p }: { p: Item }) {
  const prod = resolveCatalog(p);

  // Prefer catalog values; safely fall back to incoming props
  const id = prod ? String(prod.id) : String(p.id);
  const slug = prod?.slug ?? toSlug(p.id || p.title);
  const title = prod?.title ?? p.title;
  const image =
    (prod?.images && prod.images[0]) ||
    prod?.image ||
    (typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg");

  const numericIncoming =
    typeof p.price === "number"
      ? p.price
      : typeof p.price === "string"
        ? parseFloat(p.price)
        : 0;

  const price = typeof prod?.price === "number" ? prod.price : numericIncoming;
  const description = prod?.description ?? p.description ?? "";

  const [open, setOpen] = useState(false);

  return (
    <div
      key={id}
      id={id}
      className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
    >
      <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>

        {/* Subtitle + inline toggle, like /products: */}
        {!!description && (
          <>
            <p className={`text-gray-600 text-sm ${open ? "" : "line-clamp-2"}`}>{description}</p>
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="mt-1 text-sm font-medium text-blue-600 hover:underline"
            >
              {open ? "Less" : "More"}
            </button>
          </>
        )}

        <p className="text-lg font-bold mt-2 mb-3">{formatEUR(price)}</p>

        {/* Blue View (/checkout) + Add to Cart (/cart after add) */}
        <ShopActions
          item={{
            // Use slug as stable cart key when possible
            id: slug || id,
            title,
            price,
            image,
            description,
          }}
        />
      </div>
    </div>
  );
}

export default function BestSellersGrid({ items }: { items: Item[] }) {
  return (
    <>
      <CartAutoRedirect />
      <CategoryGrid
        items={items}
        expandAll
        renderItem={(p) => <BestSellerCard p={p as Item} />}
      />
    </>
  );
}
