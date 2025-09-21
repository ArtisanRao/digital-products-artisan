// components/product-actions.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";

type Item = {
  id: number | string;
  title: string;
  price: number;
  image: string;
  description?: string;
};

type Props = {
  item: Item;
  /** Show a “View” button that links to the product detail page (optional). */
  viewHref?: string;
  /** If false, hides the “Buy” button (optional, default true). */
  buyEnabled?: boolean;
  /** Accepted for compatibility; pass through if your AddToCartButton supports it. */
  goToCartAfterAdd?: boolean;
  className?: string;
  rightSlot?: React.ReactNode;
};

export default function ProductActions({
  item,
  viewHref,
  buyEnabled = true,
  goToCartAfterAdd, // kept for callers; wire to AddToCartButton if supported
  className,
  rightSlot,
}: Props) {
  const onBuy = React.useCallback(() => {
    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id, qty: 1 }),
        });
        const txt = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(txt);
        } catch {}
        if (!res.ok || !data?.url) {
          throw new Error(data?.error || txt || `Checkout failed (${res.status})`);
        }
        window.location.href = data.url as string;
      } catch (err: any) {
        console.error("Checkout error:", err);
        alert(err?.message || "Couldn’t start checkout.");
      }
    })();
  }, [item.id]);

  return (
    <div className={["flex items-center gap-3", className].filter(Boolean).join(" ")}>
      {viewHref ? (
        <Button asChild variant="secondary" className="shrink-0">
          <Link href={viewHref}>View</Link>
        </Button>
      ) : null}

      <AddToCartButton
        productId={item.id}
        className="shrink-0"
        // If supported in your implementation, uncomment the next line:
        // goToCartAfterAdd={goToCartAfterAdd}
      />

      {buyEnabled ? (
        <Button
          type="button"
          className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={onBuy}
        >
          Buy
        </Button>
      ) : null}

      {rightSlot ? <div className="ml-auto">{rightSlot}</div> : null}
    </div>
  );
}
