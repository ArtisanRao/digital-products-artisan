// components/buy-now-button.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { getPreferredCurrency } from "@/lib/currency";

type Currency = "eur" | "usd";

function clampQty(qty: unknown, min = 1, max = 50) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

export default function BuyNowButton({
  productId,
  qty = 1,
  className,
  children,
}: {
  productId: number | string;
  qty?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (loading) return; // guard against double clicks
    setLoading(true);
    try {
      // Prefer site helper, fall back to EUR in EU or USD otherwise (server will also decide)
      let currency: Currency | undefined;
      try {
        const c = (getPreferredCurrency?.() as string | undefined)?.toLowerCase();
        if (c === "eur" || c === "usd") currency = c as Currency;
      } catch {
        // ignore helper failures; server decides
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Always include currency hint if we have it
        body: JSON.stringify({
          productId,
          qty: clampQty(qty),
          ...(currency ? { currency } : {}),
        }),
        cache: "no-store",
        keepalive: true,
      });

      // robust parse
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { /* non-JSON error */ }

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
  };

  const baseClasses =
    "gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500";
  const cls = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cls}
      aria-busy={loading}
      data-state={loading ? "loading" : "idle"}
      aria-label="Buy now"
    >
      {loading ? "Redirecting..." : (children ?? "Buy")}
    </Button>
  );
}
