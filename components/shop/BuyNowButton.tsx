"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function BuyNowButton({
  productId,
  qty = 1,
  className = "",
}: {
  productId: number;
  qty?: number;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleBuyNow = async () => {
    if (!productId || loading) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: [{ productId, qty: Math.max(1, qty) }] }),
      });
      const data = await resp.json().catch(() => ({} as any));
      if (!resp.ok || !data?.url) {
        console.error("Checkout error:", data);
        alert(data?.error || "Sorry—couldn’t start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string; // go to payment
    } catch (e) {
      console.error(e);
      alert("Network error starting checkout.");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={loading}
      className={`inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 ${className}`}
      aria-busy={loading}
    >
      <Zap className="w-5 h-5 text-yellow-300" />
      {loading ? "Redirecting…" : "Buy now"}
    </Button>
  );
}
