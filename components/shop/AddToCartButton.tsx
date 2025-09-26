"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as cart from "@/lib/cart";

type Props = {
  id?: string | number;
  slug?: string;
  title: string;
  price?: number | string;
  image?: string;
  className?: string;
};

export default function AddToCartButton({
  id,
  slug,
  title,
  price,
  image,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);

  const numericPrice =
    typeof price === "number"
      ? price
      : Number(String(price ?? "").replace(/[^\d.-]+/g, "")) || 0;

  const key = String(id ?? slug ?? title);

  const onClick = () => {
    try {
      setLoading(true);
      cart.addToCart({ id: key, title, price: numericPrice, image }, 1);
      // lib/cart already updates localStorage + dispatches `cart:updated`
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={loading} className={className}>
      {loading ? "Adding…" : "Add to cart"}
    </Button>
  );
}
