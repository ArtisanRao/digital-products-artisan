"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

type Item = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  fileUrl?: string;
};

type Props = {
  item: Item;
  /** Where the blue “View” should go. Default: /checkout */
  viewHref?: string;
  /** After adding, go to /cart so the badge is visible. Default: true */
  goToCartAfterAdd?: boolean;
};

export default function ShopActions({
  item,
  viewHref = "/checkout",
  goToCartAfterAdd = true,
}: Props) {
  const router = useRouter();
  const cart = (useCart?.() ?? {}) as any;

  const persistAndBroadcast = (items: any[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(items));
    const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
      window.dispatchEvent(new CustomEvent("cart:item-added", { detail: { item, count } }));
    } catch {}
  };

  const addToLocalCart = () => {
    if (typeof window === "undefined") return;
    let items: any[] = [];
    try {
      items = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}
    const idx = items.findIndex((x) => String(x.id) === String(item.id));
    if (idx >= 0) {
      items[idx].quantity = Number(items[idx].quantity || 1) + 1;
    } else {
      items.push({
        id: String(item.id),
        name: item.title,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        fileGuid: item.fileUrl,
        url: "/categories",
        quantity: 1,
      });
    }
    persistAndBroadcast(items);
  };

  const add = () => {
    // best-effort: support any cart context shape
    (cart.addItem ?? cart.add ?? cart.actions?.addItem)?.({
      id: String(item.id),
      name: item.title,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      fileUrl: item.fileUrl,
      url: "/categories",
      quantity: 1,
    });
    (cart.openCart ?? cart.open ?? cart.actions?.openCart)?.();

    addToLocalCart();
    if (goToCartAfterAdd) router.push("/cart");
  };

  const view = () => {
    router.push(viewHref);
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      {/* VIEW — blue button linking to /checkout (or custom viewHref) */}
      <Button
        type="button"
        onClick={view}
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="View / Checkout"
      >
        <Eye className="h-4 w-4 text-white" />
        View
      </Button>

      {/* ADD TO CART — add + open cart + go to /cart */}
      <Button
        type="button"
        onClick={add}
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Add to cart"
      >
        <ShoppingCart className="h-4 w-4 text-white" />
        Add to Cart
      </Button>
    </div>
  );
}
