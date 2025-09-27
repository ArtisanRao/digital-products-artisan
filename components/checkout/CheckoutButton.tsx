// components/CheckoutButton.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;            // e.g. "bundle:ai-productivity-suite" or numeric "123"
  name: string;
  price: number;         // in major units (e.g., 29.99)
  image?: string;
  quantity?: number;
  currency?: "eur" | "usd";
  className?: string;
};

export default function CheckoutButton({
  id,
  name,
  price,
  image,
  quantity = 1,
  currency = "eur",
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

  // Prevent state updates after unmount
  useEffect(() => {
    return () => { inFlight.current = false; };
  }, []);

  const start = async () => {
    if (loading || inFlight.current) return;

    const qty = Math.max(1, Number.isFinite(quantity as number) ? Number(quantity) : 1);
    const curr = String(currency || "eur").toUpperCase(); // "EUR" | "USD"
    const isNumericId = /^\d+$/.test(id);
    const unitAmountCents = Math.round((Number(price) || 0) * 100);

    // Build a payload that supports BOTH your handlers:
    const payload = {
      // Legacy / cart-style
      cart: [
        {
          productId: isNumericId ? Number(id) : undefined,
          slug: !isNumericId ? id : undefined,
          qty,
        },
      ],
      // Line-item style
      lines: [
        {
          id,         // keep original id (slug or sku)
          name,
          price,      // major units
          unitAmountCents, // minor units for Stripe-like handlers
          image,
          quantity: qty,
        },
      ],
      currency: curr,
      meta: { source: "CheckoutButton@bundle", ts: Date.now() },
    };

    // Guard
    inFlight.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try { data = await res.json(); } catch {}

      if (res.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }

      // Fallback: navigate to client checkout with qs
      console.warn("Checkout API did not return url; falling back.", data);
      const qs = new URLSearchParams({ product: id, qty: String(qty), currency: curr }).toString();
      window.location.href = `/checkout?${qs}`;
    } catch (e) {
      console.error("Checkout start error:", e);
      alert("Network error starting checkout. Please try again.");
      setLoading(false);
      inFlight.current = false;
    }
  };

  return (
    <Button
      type="button"
      onClick={start}
      disabled={loading}
      aria-busy={loading}
      className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${className ?? ""}`}
    >
      {loading ? "Starting checkout…" : "Get This Bundle"}
    </Button>
  );
}
