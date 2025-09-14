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
  };

  const buyNow = async () => {
    addToLocalCart();

    const currency = (getPreferredCurrency?.() || "eur").toLowerCase();

    const resp = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: [
          { id: item.id, name: item.title, price: item.price, image: item.image, quantity: 1 },
        ],
        currency,
      }),
    });

    try {
      const data = await resp.json();
      if (resp.ok && data?.url) window.location.href = data.url;
      else console.error("Checkout error:", data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      {/* VIEW — now same blue style as Add to Cart */}
      <Button
        type="button"
        onClick={buyNow}
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="View / Buy now"
      >
        <Eye className="h-4 w-4 text-white" />
        View
      </Button>

      {/* ADD TO CART — unchanged visual (blue) */}
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
