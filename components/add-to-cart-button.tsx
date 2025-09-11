"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { productsById, products } from "@/data/products";

type Size = "sm" | "default" | "lg";

export default function AddToCartButton({
  productId,
  size = "default", // "default" on PDP, "sm" on grid/list cards
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

    try {
      cart = raw ? JSON.parse(raw) : [];
    } catch {
      cart = [];
    }

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

    // Persist cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // Compute total count and broadcast to header badge
    const count = cart.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items: cart } }));
      // light haptic on supported mobiles (optional, non-blocking)
      try { navigator?.vibrate?.(10); } catch {}
    }
  }, [productId]);

  const handleClick = async () => {
    setAdding(true);
    try {
      add();
    } catch (e) {
      console.error("Failed to add to cart", e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button
      variant="cart"
      size={size}
      onClick={handleClick}
      disabled={adding}
      className={className}
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {adding ? "Adding…" : children ?? "Add to cart"}
    </Button>
  );
}
