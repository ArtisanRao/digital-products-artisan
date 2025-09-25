"use client";
import { useEffect, useState } from "react";
import * as cart from "@/lib/cart";

/** Safely get the cart count across multiple implementations */
function getCountSafe(): number {
  if (typeof window === "undefined") return 0;
  try {
    // 1) Prefer your /lib/cart module if it exposes counters
    const mod: any = cart;
    if (typeof mod.getCartCount === "function") return Number(mod.getCartCount()) || 0;
    if (typeof mod.count === "function") return Number(mod.count()) || 0;

    // 2) Known globals (legacy shims)
    const w = window as any;
    if (w?.__CART__?.count) return Number(w.__CART__.count()) || 0;
    if (w?.dpaCart?.count) return Number(w.dpaCart.count()) || 0;

    // 3) Fallback: check common localStorage shapes
    const keys = ["cart:v1", "cart.v1", "dpa:cart", "cart"];
    for (const k of keys) {
      const raw = window.localStorage.getItem(k);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          // Array of items: { quantity } or { qty }
          const nums = parsed.map((it) => Number((it && (it.quantity ?? it.qty)) ?? 0));
          return nums.reduce((a, b) => a + b, 0);
        }

        if (parsed && typeof parsed === "object") {
          // Map { key: qty }
          const values = Object.values(parsed as Record<string, number | string>);
          const nums = values.map((q) => (typeof q === "number" ? q : Number(q) || 0));
          return nums.reduce((a, b) => a + b, 0);
        }
      } catch {
        // ignore parse errors and try next key
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

export default function CartBadge({ className = "" }: { className?: string }) {
  const [c, setC] = useState(0);

  useEffect(() => {
    const update = () => setC(getCountSafe());
    update();

    // Prefer numeric detail when available (cart:count)
    const onCount = (e: Event) => {
      const d = (e as CustomEvent<number | undefined>).detail;
      if (typeof d === "number") setC(d);
      else update();
    };

    const events: Array<keyof WindowEventMap> = [
      "cart:count",
      "cart:change",
      "cart-update",
      "cart:add",
      "cart:remove",
    ];

    events.forEach((name) => window.addEventListener(name, onCount as EventListener));

    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (["cart:v1", "cart.v1", "dpa:cart", "cart"].includes(e.key)) update();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      events.forEach((name) => window.removeEventListener(name, onCount as EventListener));
      window.removeEventListener("storage", onStorage);
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
