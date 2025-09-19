"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string | number;   // slug or id used in the API catalog
  quantity?: number;
  className?: string;
  label?: string;
};

export default function StripeBuyButton({
  productId,
  quantity = 1,
  className,
  label = "Buy",
}: Props) {
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // go to Stripe Checkout
      } else {
        console.error("Stripe session error:", data);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={buy}
      disabled={loading}
      className={`bg-blue-600 text-white hover:bg-blue-700 ${className ?? ""}`}
    >
      {loading ? "Loading…" : label}
    </Button>
  );
}
