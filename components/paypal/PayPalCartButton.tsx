"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadPayPalSDK } from "./load-paypal";
import { productsById } from "@/data/products";

declare global {
  interface Window {
    paypal?: any;
  }
}

type CartItem = {
  id: string;        // stored as string in your cart
  name: string;
  price: number;
  quantity: number;
};

export default function PayPalCartButton() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) {
      try { setCart(JSON.parse(raw)); } catch {}
    }
  }, []);

  // Map to slugs+qty using your products table
  const items = useMemo(
    () =>
      cart
        .map((c) => {
          const p = productsById[Number(c.id)];
          if (!p) return null;
          return { slug: p.slug, qty: c.quantity };
        })
        .filter(Boolean),
    [cart]
  );

  useEffect(() => {
    const run = async () => {
      try {
        await loadPayPalSDK();
        if (!window.paypal || !ref.current) return;

        const baseUrl = window.location.origin;

        window.paypal
          .Buttons({
            style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },

            createOrder: async () => {
              if (!items.length) throw new Error("Cart is empty");
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items,
                  successUrl: `${baseUrl}/order-confirmation`,
                  cancelUrl: `${baseUrl}/cart`,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || "Failed to create order");
              return data.id;
            },

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
  }, [items]);

  return <div ref={ref} />;
}
