"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { productsById, products } from "@/data/products";

type Size = "sm" | "default" | "lg";

export default function AddToCartButton({
  productId,
  size = "default",
  className = "",
  children,
}: {
  productId: number;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}) {
  const [adding, setAdding] = React.useState(false);

  const add = React.useCallback(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : "[]";
    let cart: Array<any> = [];
    try { cart = raw ? JSON.parse(raw) : []; } catch { cart = []; }

    const p = productsById[productId] || products.find((x) => x.id === productId);
    if (!p) return;

    const idStr = String(p.id);
    const found = cart.find((i) => i.id === idStr);
    if (found) {
      const currentQty = Math.max(1, Number(found.quantity || 1));
      found.quantity = currentQty + 1;
    } else {
      cart.push({
        id: idStr,
        name: p.title,
        price: p.price,
        quantity: 1,
        image: p.images?.[0] ?? p.image,
        url: `/products/${p.id}`,
        description: p.description,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    const count = cart.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));

    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items: cart } }));
      navigator?.vibrate?.(10);
    } catch {}
  }, [productId]);

  const handleClick = async () => {
    setAdding(true);
    try { add(); } finally { setAdding(false); }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={adding}
      size={size}
      className={`bg-black text-white hover:bg-black/90 ${className}`}
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {adding ? "Adding…" : children ?? "Add to cart"}
    </Button>
  );
}
