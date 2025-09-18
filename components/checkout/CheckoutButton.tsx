"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;            // e.g. "bundle:ai-productivity-suite"
  name: string;
  price: number;
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

  const start = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ id, name, price, image, quantity }],
          currency,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", data);
        alert("Sorry—couldn’t start checkout. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={start}
      disabled={loading}
      className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${className ?? ""}`}
    >
      {loading ? "Starting checkout…" : "Get This Bundle"}
    </Button>
  );
}
