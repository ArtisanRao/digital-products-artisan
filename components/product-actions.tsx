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
  /** Product info used for cart actions / analytics */
  item: Item;

  /** If provided, show a “View” button linking to the PDP */
  viewHref?: string;

  /** If false, hide the “Buy”/Checkout button (e.g., on category pages). Default: true */
  buyEnabled?: boolean;

  /**
   * Optional behavior hint for add-to-cart flows.
   * We accept it for compatibility with callers; it’s a no-op here unless your AddToCartButton uses it.
   */
  goToCartAfterAdd?: boolean;

  /** Extra classes for the wrapper */
  className?: string;

  /** Render children (e.g., badges) to the right of the buttons */
  rightSlot?: React.ReactNode;
};

export default function ProductActions({
  item,
  viewHref,
  buyEnabled = true,
  goToCartAfterAdd, // accepted for compatibility; not required by this component
  className,
  rightSlot,
}: Props) {
  // You can wire `goToCartAfterAdd` into AddToCartButton if it supports it in your codebase.
  // For now, we ignore it safely to satisfy callers that pass it.

  return (
    <div className={["flex items-center gap-3", className].filter(Boolean).join(" ")}>
      {/* View (only if a link is provided) */}
      {viewHref ? (
        <Button asChild variant="secondary" className="shrink-0">
          <Link href={viewHref}>View</Link>
        </Button>
      ) : null}

      {/* Add to cart — always available */}
      <AddToCartButton
        productId={item.id}
        className="shrink-0"
        // If your AddToCartButton supports this prop, uncomment next line:
        // goToCartAfterAdd={goToCartAfterAdd}
      />

      {/* Buy / Checkout — optional */}
      {buyEnabled ? (
        <Button
          type="button"
          className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => {
            // Minimal client-side checkout starter. Replace with your real handler if needed.
            void (async () => {
              try {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: item.id, qty: 1 }),
                });
                const txt = await res.text();
                let data: any = {};
                try { data = JSON.parse(txt); } catch {}
                if (!res.ok || !data?.url) throw new Error(data?.error || txt || `Checkout failed (${res.status})`);
                window.location.href = data.url as string;
              } catch (err: any) {
                console.error("Checkout error:", err);
                alert(err?.message || "Couldn’t start checkout.");
              }
            })();
          }}
        >
          Buy
        </Button>
      ) : null}

      {rightSlot ? <div className="ml-auto">{rightSlot}</div> : null}
    </div>
  );
}
