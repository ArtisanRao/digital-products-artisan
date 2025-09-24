"use client";
import { useEffect, useState } from "react";
import * as cart from "@/lib/cart";

/** Get cart count safely across both cart implementations */
function getCountSafe(): number {
  if (typeof window === "undefined") return 0;
  try {
    const mod: any = cart;
    if (typeof mod.getCartCount === "function") return mod.getCartCount();
    if (typeof mod.count === "function") return mod.count();

    // Fallback: read known keys directly
    const keys = ["cart.v1", "dpa:cart"];
    for (const k of keys) {
      const raw = window.localStorage.getItem(k);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.reduce((n, it) => n + (it?.qty ?? 0), 0);
      }
    }
  } catch {}
  return 0;
}

export default function CartBadge({ className = "" }: { className?: string }) {
  const [c, setC] = useState(0);

  useEffect(() => {
    const update = () => setC(getCountSafe());
    update();

    // Listen to both possible event names for compatibility
    const handler = () => update();
    window.addEventListener("cart-update", handler);
    window.addEventListener("cart:change", handler);

    return () => {
      window.removeEventListener("cart-update", handler);
      window.removeEventListener("cart:change", handler);
    };
  }, []);

  if (!c) return null;

  return (
    <span
      aria-label={`Cart items: ${c}`}
      className={`ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white ${className}`}
    >
      {c}
    </span>
  );
}
