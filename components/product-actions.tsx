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

  /** When provided, show a "View" link button that navigates to the PDP. */
  viewHref?: string;

  /** If true, redirect to cart after add (kept for API compatibility). */
  goToCartAfterAdd?: boolean;

  /** If false, hide the "Buy" button (e.g., on category tiles). */
  buyEnabled?: boolean;

  /** Optional className passthrough for container */
  className?: string;
};

export default function ProductActions({
  item,
  viewHref,
  goToCartAfterAdd, // currently unused by AddToCartButton, kept for compatibility
  buyEnabled = true,
  className,
}: Props) {
  // Only allow Add to Cart / Buy when we have a numeric product id
  const numericId = typeof item.id === "number" ? item.id : undefined;
  const canTransact = Number.isFinite(numericId as number);

  return (
    <div className={["flex items-center gap-3", className || ""].join(" ")}>
      {/* View button (optional) */}
      {viewHref ? (
        <Button asChild variant="outline">
          <Link href={viewHref}>View</Link>
        </Button>
      ) : null}

      {/* Add to Cart — enabled only when we have a numeric product id */}
      <AddToCartButton
        productId={numericId as number}
        disabled={!canTransact}
        className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        // @ts-expect-error: supported by our backend implementation if you wire it later
        goToCartAfterAdd={goToCartAfterAdd}
      />

      {/* Buy — hidden when buyEnabled === false or when id is not numeric */}
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
