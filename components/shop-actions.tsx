"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { getPreferredCurrency } from "@/lib/currency";
import { useCart } from "@/contexts/cart-context";

type Item = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  fileUrl?: string;
};

export default function ShopActions({ item }: { item: Item }) {
  // Your provider should exist, but we guard just in case
  const cart = (useCart?.() ?? {}) as any;

  const persistAndBroadcast = (items: any[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
    } catch {}
  };

  const addToLocalCart = () => {
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
    // Try context first
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

    // Always keep localStorage in sync for the badge and /cart page
    addToLocalCart();
  };

  const buyNow = async () => {
    // Ensure present in local cart (badge stays correct)
    addToLocalCart();

    const currency = (getPreferredCurrency?.() || "eur").toLowerCase();
    const resp = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: [
          {
            id: item.id,
            name: item.title,
            price: item.price, // numeric amount in chosen currency units
            image: item.image,
            quantity: 1,
          },
        ],
        currency,
      }),
    });

    try {
      const data = await resp.json();
      if (resp.ok && data?.url) {
        window.location.href = data.url; // 👉 straight to Stripe Checkout
      } else {
        console.error("Checkout error:", data);
        // Optional: toast error
      }
    } catch (e) {
      console.error(e);
    }
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
