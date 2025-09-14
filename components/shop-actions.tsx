"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context"; // your existing context

type Item = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  fileUrl?: string;
  // you can add more fields if your cart needs them (sku, currency, etc.)
};

export default function ShopActions({ item }: { item: Item }) {
  // cart-context typings may vary across projects; treat as any to be compatible
  const cart = (useCart?.() ?? {}) as any;
  const router = useRouter();

  const add = () => {
    // Try a few common method names to be resilient
    (cart.addItem ?? cart.add ?? cart.actions?.addItem)?.({
      id: item.id,
      name: item.title,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      fileUrl: item.fileUrl,
      url: `/categories`, // canonical url for analytics
      quantity: 1,
    });

    // open the cart drawer if the API exists
    (cart.openCart ?? cart.open ?? cart.actions?.openCart)?.();
  };

  const buyNow = () => {
    // ensure it’s in cart, then go to checkout
    (cart.addItem ?? cart.add ?? cart.actions?.addItem)?.({
      id: item.id,
      name: item.title,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      fileUrl: item.fileUrl,
      url: `/categories`,
      quantity: 1,
      replaceIfExists: true,
    });

    // push to your existing checkout route (which then redirects to Stripe)
    router.push(`/checkout?buyNow=1&item=${encodeURIComponent(item.id)}`);
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
        View
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
