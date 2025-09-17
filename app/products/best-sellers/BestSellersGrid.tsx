"use client";

import { useEffect } from "react";
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

/** Auto-redirect to /cart after Add to Cart (Snipcart or custom event) */
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

export default function BestSellersGrid({ items }: { items: Item[] }) {
  return (
    <>
      <CartAutoRedirect />
      <CategoryGrid
        items={items}
        // Force a "Read more" on small lists: 1 item visible at first on all bps
        collapsedCountByBp={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
        increment={4}
        renderItem={(p) => {
          const id = String(p.id);
          const title = p.title;
          const image = typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg";
          const description = p.description ?? "";
          const price =
            typeof p.price === "number"
              ? p.price
              : typeof p.price === "string"
              ? parseFloat(p.price)
              : 0;

          return (
            <div
              key={id}
              id={id}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{title}</h2>
                <p className="text-gray-600 mb-2 text-sm">{description}</p>
                <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                {/* Keep only the BLUE actions from ShopActions */}
                <ShopActions
                  item={{ id, title, price, image, description }}
                  viewHref="/checkout"      // ← send “View” to Checkout
                />
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
