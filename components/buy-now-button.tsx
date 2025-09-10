// components/buy-now-button.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  productId: number;
  qty?: number;
  className?: string;
  children?: React.ReactNode;
};

export default function BuyNowButton({
  productId,
  qty = 1,
  className,
  children,
}: Props) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });

      // Try to parse a JSON body even on error to surface a helpful message
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.url) {
        const message =
          (data && data.error) ||
          `Checkout failed (status ${res.status})`;
        throw new Error(message);
      }

      // Stripe Checkout URL – redirect the browser
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error("BuyNowButton error:", err);
      alert(err?.message || "Sorry—couldn't start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Redirecting..." : (children ?? "Buy now")}
    </Button>
  );
}
