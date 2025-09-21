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
  /** When provided, shows a "View" button linking to the product page */
  viewHref?: string;
  /** When true, redirect to cart after add (default: false) */
  goToCartAfterAdd?: boolean;
  /** Optional flag used by some pages; safe to ignore here */
  buyEnabled?: boolean;
  className?: string;
};

export default function ProductActions({
  item,
  viewHref,
  goToCartAfterAdd = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  buyEnabled, // accepted for compatibility; not used by this component
  className,
}: Props) {
  const productId = typeof item.id === "string" ? Number(item.id) : item.id;

  return (
    <div className={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <AddToCartButton productId={productId} goToCartAfterAdd={goToCartAfterAdd} />
      {viewHref ? (
        <Link href={viewHref}>
          <Button variant="outline">View</Button>
        </Link>
      ) : null}
    </div>
  );
}
