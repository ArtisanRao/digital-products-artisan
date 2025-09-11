// components/paypal-button.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LineItem = { productId: number; qty?: number };

export default function PayPalButton({
  items,
  className,
}: {
  items: LineItem[];
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Normalize the payload we send to our server routes
  const payload = useMemo(
    () => ({
      items: items.map((i) => ({ productId: i.productId, qty: i.qty ?? 1 })),
    }),
    [items]
  );

  // Load PayPal JS SDK once
  useEffect(() => {
    if (!clientId) return;

    // If script already there, mark ready
    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (existing && (window as any).paypal) {
      setReady(true);
      return;
    }

    // Inject script
    const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=USD&intent=CAPTURE&components=buttons`;

    const s = document.createElement("script");
    s.id = "paypal-sdk";
    s.src = src;
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setReady(false);
    document.body.appendChild(s);

    return () => {
      // do not remove the script on unmount; it can be reused across pages
    };
  }, [clientId]);

  // Render the PayPal button (re-render when items change)
  useEffect(() => {
    const paypal = (window as any).paypal;
    const el = containerRef.current;
    if (!ready || !paypal || !el) return;

    // Clear previous button instance if any
    el.innerHTML = "";

    paypal
      .Buttons({
        style: { layout: "vertical", shape: "rect", label: "paypal" },

        // Create order on our server so prices/IDs are trusted
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok || !data?.id) throw new Error(data?.error || "Unable to create order");
          return data.id;
        },

        // Capture the order on our server, then send user to confirmation
        onApprove: async (data: any) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });
          const out = await res.json();
          if (out?.status !== "COMPLETED") throw new Error("Payment not completed");

          // Optional: stash quick links for the confirmation page to read
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
