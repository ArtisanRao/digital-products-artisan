// components/buy-now-button.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function BuyNowButton({
  productId,
  qty = 1,
  className,
  children,
}: {
  productId: number;
  qty?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });

      // Try to get the most useful message back
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { /* keep text */ }

      if (!res.ok || !data?.url) {
        const message = data?.error || text || `Checkout failed (HTTP ${res.status})`;
        throw new Error(message);
      }

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
