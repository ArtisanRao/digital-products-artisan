// components/paypal/PayPalSingleButton.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function PayPalSingleButton({
  productId,
  quantity = 1,
  className,
}: {
  productId: number;
  quantity?: number;
  className?: string;
}) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const payload = useMemo(
    () => ({ items: [{ productId, qty: Math.max(1, Number(quantity) || 1) }] }),
    [productId, quantity]
  );

  // Load PayPal SDK once
  useEffect(() => {
    if (!clientId) return;

    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (existing && (window as any).paypal) {
      setReady(true);
      return;
    }

    if (!existing) {
      const s = document.createElement("script");
      s.id = "paypal-sdk";
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId
      )}&currency=USD&intent=CAPTURE&components=buttons`;
      s.async = true;
      s.onload = () => setReady(true);
      s.onerror = () => setReady(false);
      document.body.appendChild(s);
    } else {
      setReady(true);
    }
  }, [clientId]);

  // Render buttons when SDK is ready or payload changes
  useEffect(() => {
    const paypal = (window as any).paypal;
    const el = containerRef.current;
    if (!ready || !paypal || !el) return;

    // Re-render cleanly if props change
    el.innerHTML = "";

    paypal
      .Buttons({
        style: { layout: "vertical", shape: "rect", label: "paypal" },

        // Create an order on our server with trusted prices
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok || !data?.id) {
            throw new Error(data?.error || "Unable to create order");
          }
          return data.id;
        },

        // Capture on our server, then send buyer to confirmation page
        onApprove: async (data: any) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });
          const out = await res.json();
          if (out?.status !== "COMPLETED") {
            throw new Error("Payment not completed");
          }

          if (Array.isArray(out.links)) {
            sessionStorage.setItem("paypal_links_" + data.orderID, JSON.stringify(out.links));
          }
          const url = new URL(window.location.origin + "/order-confirmation");
          url.searchParams.set("provider", "paypal");
          url.searchParams.set("order_id", data.orderID);
          window.location.assign(url.toString());
        },

        onError: (err: any) => {
          console.error("PayPal error:", err);
          alert("PayPal checkout failed. Please try again.");
        },
      })
      .render(el);
  }, [ready, payload]);

  if (!clientId) {
    return (
      <div className={className}>
        <button
          className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700"
          disabled
          title="Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID"
        >
          PayPal (not configured)
        </button>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
