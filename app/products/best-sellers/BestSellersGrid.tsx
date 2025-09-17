"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

type Item = {
  id: string;
  title: string;
  image: string;
  price: number | string;
  description: string;
};

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

const truncate = (s: string, max: number) => {
  if (!s) return "";
  if (s.length <= max) return s;
  const clipped = s.slice(0, max);
  return clipped.replace(/\s+\S*$/, "") + "…";
};

/** After "Add to Cart", go to /cart so the badge is immediately visible. */
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
  const id = String(p.id);
  const title = p.title;
  const image = typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg";
  const price =
    typeof p.price === "number" ? p.price : typeof p.price === "string" ? parseFloat(p.price) : 0;

  const [open, setOpen] = useState(false);
  const maxChars = 110; // tweak as you like
  const hasOverflow = (p.description || "").length > maxChars;
  const shown = open ? p.description : truncate(p.description, maxChars);

  return (
    <div
      key={id}
      id={id}
      className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
    >
      <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>

        {/* Subtitle + inline "More" link (like your /products list) */}
        <p className="text-gray-600 text-sm">{shown}</p>
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-1 text-sm font-medium text-blue-600 hover:underline"
          >
            {open ? "Less" : "More"}
          </button>
        )}

        <p className="text-lg font-bold mt-2 mb-3">{formatEUR(price)}</p>

        {/* Keep only BLUE actions (View -> /checkout, Add to Cart -> /cart) */}
        <ShopActions item={{ id, title, price, image, description: p.description }} />
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
        expandAll                     // ← no grid-level "Read more" button
        renderItem={(p) => <BestSellerCard p={p as Item} />}
      />
    </>
  );
}
