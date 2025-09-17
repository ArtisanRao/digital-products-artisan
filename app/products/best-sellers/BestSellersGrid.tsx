"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

type Item = {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
};

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

/**
 * After "Add to Cart", push to /cart to show the badge counter/front-and-center.
 * Works with Snipcart (`snipcart.item.added`) or a custom event (`cart:item-added`).
 * Remove this effect if you prefer to stay on the same page after adding.
 */
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
        renderItem={(p) => {
          const { id, title, image, price, description } = p;
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

                {/* Actions: View (Checkout) + Add to Cart */}
                <div className="flex gap-2">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-muted/30"
                  >
                    View
                  </Link>

                  <ShopActions
                    item={{ id, title, price, image, description }}
                    // if your ShopActions supports props like onAdded, you can navigate there too.
                  />
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
