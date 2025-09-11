"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { productsById, products } from "@/data/products";

type Size = "sm" | "default" | "lg";

export default function AddToCartButton({
  productId,
  size = "default",           // ↩ match context: "default" on PDP, "sm" on grid/list cards
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
    try {
      const p = productsById[productId] || products.find(x => x.id === productId);
      if (!p) return;

      const raw = localStorage.getItem("cart");
      const cart: Array<any> = raw ? JSON.parse(raw) : [];

      const idStr = String(p.id);
      const found = cart.find((i) => i.id === idStr);
      if (found) found.quantity = Math.max(1, Number(found.quantity || 1)) + 1;
      else {
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
    } catch (e) {
      console.error("Failed to add to cart", e);
    }
  }, [productId]);

  const handleClick = async () => {
    setAdding(true);
    try {
      add();
    } finally {
      setAdding(false);
    }
  };

  // icon size normalized to w-4 h-4 to match other buttons
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
