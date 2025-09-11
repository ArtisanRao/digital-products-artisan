"use client";

import { useEffect, useRef } from "react";
import { loadPayPalSDK } from "./load-paypal";
import { productsById } from "@/data/products";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalSingleButton({
  productId,
  qty = 1,
}: {
  productId: number;
  qty?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        await loadPayPalSDK();
        const product = productsById[productId];
        if (!product || !window.paypal || !ref.current) return;

        const baseUrl = window.location.origin;

        window.paypal
          .Buttons({
            style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },

            // Create the PayPal order on your server
            createOrder: async () => {
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: [{ slug: product.slug, qty }],
                  successUrl: `${baseUrl}/order-confirmation`,
                  cancelUrl: `${baseUrl}/products/${product.id}`,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || "Failed to create order");
              return data.id; // PayPal order ID
            },

            // Capture on your server, then go to confirmation
            onApprove: async (data: any) => {
              await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
              });
              window.location.href = "/order-confirmation";
            },

            onError: (err: any) => {
              console.error("PayPal error", err);
              alert("PayPal error. Please try again or use card checkout.");
            },
          })
          .render(ref.current);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [productId, qty]);

  return <div ref={ref} />;
}
