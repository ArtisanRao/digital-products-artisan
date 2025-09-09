"use client";

import { useState } from "react";

export default function BuyNowButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1 }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url; // redirect to Stripe
    } catch (e) {
      console.error(e);
      alert("Sorry—couldn’t start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center rounded-md px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-60"
      aria-busy={loading}
    >
      {loading ? "Redirecting…" : "Buy now"}
    </button>
  );
}
