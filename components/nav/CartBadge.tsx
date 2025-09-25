"use client";
import { useEffect, useState } from "react";
import * as cart from "@/lib/cart";

// LocalStorage keys we care about (for cross-tab sync)
const LS_KEYS = ["cart.v1", "dpa:cart", "cart"] as const;

export default function CartBadge({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 1) Initialize from lib/cart
    setCount(cart.getCartCount());

    // 2) Primary subscription (typed, modern)
    const unsubscribe = cart.onChange((c) => setCount(c));

    // 3) Legacy events some parts of the app may still emit
    const legacyEvents = [
      "cart:updated",   // <= make sure we listen to this
      "cart:change",
      "cart-update",
      "cart:count",
      "cart:add",
      "cart:remove",
    ];
    const legacyHandler = () => setCount(cart.getCartCount());
    legacyEvents.forEach((name) =>
      (window as any).addEventListener(name as any, legacyHandler as EventListener)
    );

    // 4) Cross-tab sync (another tab modifies localStorage)
    const onStorage = (e: StorageEvent) => {
      if (!e.key || !LS_KEYS.includes(e.key as any)) return;
      setCount(cart.getCartCount());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      legacyEvents.forEach((name) =>
        (window as any).removeEventListener(name as any, legacyHandler as EventListener)
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span
      aria-label={`Cart items: ${count}`}
      className={`ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white ${className}`}
    >
      {count}
    </span>
  );
}
