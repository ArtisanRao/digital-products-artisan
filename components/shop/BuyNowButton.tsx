"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function BuyNowButton({
  productId,
  productSlug,
  qty = 1,
  className = "",
}: {
  productId?: number;
  productSlug?: string;
  qty?: number;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);

  const goLegacyGet = (key: string) => {
    // Fallback: old GET-style endpoint
    const url = `/api/checkout?product=${encodeURIComponent(key)}&qty=${Math.max(
      1,
      qty
    )}`;
    window.location.href = url;
  };

  const handleBuyNow = async () => {
    if (loading) return;

    const key = productSlug ?? (productId != null ? String(productId) : "");
    if (!key) {
      alert("Missing product id/slug for checkout.");
      return;
    }

    setLoading(true);
    try {
      const tryPost = async (body: any) => {
        const r = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        let data: any = {};
        try {
          data = await r.json();
        } catch {}
        return { ok: r.ok, data };
      };

      // Try known shapes (your CartCheckoutButton uses the first one)
      const attempts = [
        { cart: [{ productId: Number(productId), qty: Math.max(1, qty) }] },
        { cart: [{ id: Number(productId), quantity: Math.max(1, qty) }] },
        { items: [{ id: Number(productId), quantity: Math.max(1, qty) }] },
        { product: key, qty: Math.max(1, qty) },
      ];

      for (const payload of attempts) {
        // Skip id-based payloads if no productId
        if (
          ("productId" in (payload.cart?.[0] ?? {})) &&
          !Number.isFinite(Number(productId))
        ) {
          continue;
        }
        if (("id" in (payload.cart?.[0] ?? {})) && !Number.isFinite(Number(productId))) {
          continue;
        }
        if (("id" in (payload.items?.[0] ?? {})) && !Number.isFinite(Number(productId))) {
          continue;
        }

        const { ok, data } = await tryPost(payload);
        if (ok && data?.url) {
          window.location.href = data.url as string; // go to payment
          return;
        }
      }

      // Final fallback: GET redirect
      goLegacyGet(key);
    } catch (e) {
      console.error(e);
      // Fallback GET even on network error
      const key2 = productSlug ?? (productId != null ? String(productId) : "");
      if (key2) goLegacyGet(key2);
      else alert("Could not start checkout.");
    } finally {
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
