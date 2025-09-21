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

  /** Show a "View" button linking to PDP when provided */
  viewHref?: string;

  /** Kept for compatibility; pass-through to AddToCart when wired */
  goToCartAfterAdd?: boolean;

  /** Hide the Buy button when false (e.g. on category tiles) */
  buyEnabled?: boolean;

  className?: string;
};

export default function ProductActions({
  item,
  viewHref,
  goToCartAfterAdd,
  buyEnabled = true,
  className,
}: Props) {
  const numericId = typeof item.id === "number" ? item.id : Number.NaN;
  const canTransact = Number.isFinite(numericId);

  return (
    <div className={["flex items-center gap-3", className || ""].join(" ")}>
      {viewHref ? (
        <Button asChild variant="outline">
          <Link href={viewHref}>View</Link>
        </Button>
      ) : null}

      <AddToCartButton
        productId={canTransact ? (numericId as number) : (undefined as any)}
        disabled={!canTransact}
        className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        // @ts-expect-error: optional prop supported by our backend when implemented
        goToCartAfterAdd={goToCartAfterAdd}
      />

      {buyEnabled && canTransact ? (
        <Button
          asChild
          className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Link href={`/checkout?productId=${numericId}&qty=1`}>Buy</Link>
        </Button>
      ) : null}
    </div>
  );
}
