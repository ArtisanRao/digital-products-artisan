// components/cart-checkout-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export default function CartCheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!items?.length) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: items.map((it: any) => ({
            productId: it.id,
            qty: it.quantity ?? 1,
          })),
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.url) {
        console.error("Checkout error:", data);
        alert(data?.error || "Sorry—couldn’t start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Network error starting checkout.");
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={!items?.length || loading}
      className="bg-gradient-to-r from-blue-600 to-cyan-600"
    >
      {loading ? "Redirecting…" : "Checkout all"}
    </Button>
  );
}
