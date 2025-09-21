"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";

type ItemLike = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  description?: string;
};

export type Props = {
  item: ItemLike;
  viewHref?: string;
  goToCartAfterAdd?: boolean;
  buyEnabled?: boolean; // <-- IMPORTANT
  className?: string;
  actionsClassName?: string;
};

export default function ProductActions({
  item,
  viewHref,
  goToCartAfterAdd = false,
  buyEnabled = true,
  className,
  actionsClassName,
}: Props) {
  const [buyLoading, setBuyLoading] = React.useState(false);

  const handleBuy = async () => {
    if (!buyEnabled || buyLoading) return;
    setBuyLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, qty: 1 }),
      });

      const raw = await res.text();
      let data: any = {};
      try { data = JSON.parse(raw); } catch {}

      if (!res.ok || !data?.url) {
        const message = data?.error || raw || `Checkout failed (HTTP ${res.status})`;
        throw new Error(message);
      }
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err?.message || "Sorry—couldn't start checkout.");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn("flex flex-wrap gap-3", actionsClassName)}>
        <AddToCartButton
          productId={item.id}
          goToCartAfterAdd={goToCartAfterAdd}
          className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        />

        <Button
          type="button"
          onClick={handleBuy}
          disabled={!buyEnabled || buyLoading}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {buyLoading ? "Redirecting..." : "Buy"}
        </Button>

        {viewHref ? (
          <Button asChild variant="outline">
            <Link href={viewHref}>View</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
