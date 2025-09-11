// components/add-to-cart-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

type AddToCartProps = {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  children?: React.ReactNode; // optional custom label
};

export default function AddToCartButton({
  id,
  title,
  price,
  image,
  quantity = 1,
  className,
  size = "sm",
  children,
}: AddToCartProps) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : "[]";
      const cart: any[] = raw ? JSON.parse(raw) : [];

      const idx = cart.findIndex((x) => x?.id === String(id));
      if (idx >= 0) {
        cart[idx].quantity = Math.max(1, Number(cart[idx].quantity || 1) + quantity);
      } else {
        cart.push({
          id: String(id),
          name: title,
          price: Number(price),
          quantity: Math.max(1, Number(quantity) || 1),
          image,
          url: `/products/${id}`,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      // let any listeners update (cart icon, etc.)
      window.dispatchEvent(new CustomEvent("cart:change", { detail: cart }));

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) {
      console.error("add-to-cart failed", e);
      alert("Couldn’t add to cart. Please try again.");
    }
  }

  return (
    <Button onClick={addToCart} className={className} size={size} variant={added ? "secondary" : "default"}>
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> {children ?? "Add to cart"}
        </>
      )}
    </Button>
  );
}
