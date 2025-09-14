// components/shop-actions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

type Item = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  description?: string;
  fileUrl?: string;
};

export default function ShopActions({ item }: { item: Item }) {
  const cart = (useCart?.() ?? {}) as any;
  const router = useRouter();

  // Fallback: if your cart context doesn't persist/emit, do a simple localStorage add + badge update
  const fallbackAdd = () => {
    try {
      const raw = localStorage.getItem("cart");
      const items = raw ? (JSON.parse(raw) as any[]) : [];
      const idStr = String(item.id);
      const idx = items.findIndex((i) => String(i.id) === idStr);
      if (idx >= 0) {
        items[idx].quantity = Math.max(1, Number(items[idx].quantity || 1)) + 1;
      } else {
        items.push({
          id: idStr,
          name: item.title,
          title: item.title,
          price: item.price,
          image: item.image,
          description: item.description,
          fileUrl: item.fileUrl,
          url: "/categories",
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
      localStorage.setItem("cartCount", String(count));
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
    } catch {
      /* no-op */
    }
  };

  const add = () => {
    const addFn = cart.addItem ?? cart.add ?? cart.actions?.addItem;
    if (typeof addFn === "function") {
      addFn({
        id: String(item.id), // keep as string for consistency across pages
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
    } else {
      // fallback so the badge updates and Cart page sees the item
      fallbackAdd();
    }
  };

  const buyNow = () => {
    // ensure it’s in the cart (replace quantity to 1 for a clean buy-now)
    const addFn = cart.addItem ?? cart.add ?? cart.actions?.addItem;
    if (typeof addFn === "function") {
      addFn({
        id: String(item.id),
        name: item.title,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        fileUrl: item.fileUrl,
        url: "/categories",
        quantity: 1,
        replaceIfExists: true,
      });
    } else {
      fallbackAdd();
    }
    // go straight to your Checkout page (which creates a Stripe session)
    router.push(`/checkout?buyNow=1&item=${encodeURIComponent(String(item.id))}`);
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={buyNow}
        className="gap-2 group"
        aria-label="View / Buy now"
      >
        <Eye className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
        <span className="text-blue-600 group-hover:text-blue-700">View</span>
      </Button>

      <Button
        type="button"
        onClick={add}
        className="gap-2 bg-blue-600 hover:bg-blue-700"
        aria-label="Add to cart"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}
