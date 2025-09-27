"use client";

import { useEffect, useState } from "react";
import * as cart from "@/lib/cart";

// LocalStorage keys we care about (for cross-tab sync)
const LS_KEYS = ["cart.v1", "dpa:cart", "cart"] as const;

function readLocalFallback(): number {
  try {
    // Prefer new key, then legacy ones
    for (const key of LS_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const obj = JSON.parse(raw) as Record<string, number>;
      const count = Object.values(obj).reduce((a, b) => a + Number(b || 0), 0);
      if (Number.isFinite(count)) return count;
    }
  } catch {}
  return 0;
}

function safeGetCartCount(): number {
  try {
    if (typeof cart?.getCartCount === "function") {
      const n = cart.getCartCount();
      if (Number.isFinite(n)) return n;
    }
  } catch {}
  // Shadow/global count set by various parts of the app
  const shadow = (globalThis as any).__CART_COUNT__;
  if (Number.isFinite(shadow)) return shadow as number;
  return readLocalFallback();
}

export default function CartBadge({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 1) Initialize
    setCount(safeGetCartCount());

    // 2) Primary subscription via lib/cart (if available)
    let unsubscribe = () => {};
    try {
      if (typeof cart?.onChange === "function") {
        unsubscribe = cart.onChange((c: number) => {
          if (Number.isFinite(c)) setCount((prev) => (prev !== c ? c : prev));
        });
      }
    } catch {}

    // 3) Legacy/custom events still emitted around the app
    const legacyEvents = [
      "cart:updated", // { detail: { count } }
      "cart:change",
      "cart-update",
      "cart:count",   // { detail: number }
      "cart:add",
      "cart:remove",
    ];

    const onLegacy = (e: Event) => {
      const anyEvt = e as CustomEvent<any>;
      const direct = Number(anyEvt?.detail);
      const nested = Number(anyEvt?.detail?.count);
      if (Number.isFinite(direct)) {
        setCount((prev) => (prev !== direct ? direct : prev));
      } else if (Number.isFinite(nested)) {
        setCount((prev) => (prev !== nested ? nested : prev));
      } else {
        // fallback recount
        const n = safeGetCartCount();
        setCount((prev) => (prev !== n ? n : prev));
      }
    };

    legacyEvents.forEach((name) =>
      window.addEventListener(name as any, onLegacy as EventListener),
    );

    // 4) Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (!e.key || !LS_KEYS.includes(e.key as any)) return;
      const n = safeGetCartCount();
      setCount((prev) => (prev !== n ? n : prev));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      try { unsubscribe(); } catch {}
      legacyEvents.forEach((name) =>
        window.removeEventListener(name as any, onLegacy as EventListener),
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span
      data-cart-badge
      aria-live="polite"
      aria-label={`Cart items: ${count}`}
      className={`ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white ${className}`}
    >
      {count}
    </span>
  );
}
