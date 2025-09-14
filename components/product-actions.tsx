"use client";

import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { startCheckout } from "@/lib/checkout";
import { useCart } from "@/contexts/cart-context";

type Props = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

export default function ProductActions({ id, title, price, image }: Props) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    try {
      setLoading(true);
      await startCheckout([{ id, name: title, price, image, quantity: 1 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* VIEW — blue text & ring, hoverable/clickable */}
      <button
        type="button"
        onClick={handleView}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-blue-600
                   hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                   disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="View / Buy now"
      >
        <Eye className="h-4 w-4" />
        View
      </button>

      {/* ADD TO CART — solid blue */}
      <button
        type="button"
        onClick={() => addItem({ id, name: title, price, image, quantity: 1 })}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Add to cart"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
}
