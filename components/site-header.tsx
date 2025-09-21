"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

function getCartCountSafe(): number {
  try {
    // 1) Fast path: cartCount
    const rawCount = localStorage.getItem("cartCount");
    if (rawCount != null && rawCount !== "") {
      const n = Number(rawCount);
      if (!Number.isNaN(n) && n >= 0) return n;
    }

    // 2) Fallback: compute from cart (supports quantity and legacy qty)
    const raw = localStorage.getItem("cart");
    const items = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum: number, it: any) => {
      const q = it?.quantity ?? it?.qty ?? 1;
      const n = Number(q);
      return sum + (Number.isFinite(n) && n > 0 ? n : 1);
    }, 0);
  } catch {
    return 0;
  }
}

export function SiteHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => setCount(getCartCountSafe());
    read(); // on mount

    const onCartUpdated = (e: Event) => {
      const d = (e as CustomEvent<{ count?: number }>).detail;
      if (d && typeof d.count === "number") setCount(d.count);
      else read();
    };

    // Sync across app & tabs and when user returns to the tab
    window.addEventListener("cart:updated", onCartUpdated as EventListener);
    window.addEventListener("storage", read);             // other tabs
    window.addEventListener("focus", read as EventListener);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") read();
    });

    return () => {
      window.removeEventListener("cart:updated", onCartUpdated as EventListener);
      window.removeEventListener("storage", read);
      window.removeEventListener("focus", read as EventListener);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* TODO: your left nav / logo here */}

        <Link href="/cart" className="relative inline-flex items-center">
          <ShoppingCart className="h-6 w-6" />
          <span
            className={[
              "absolute -right-2 -top-2 min-w-[1.25rem] h-5 px-1",
              "rounded-full bg-blue-600 text-white text-xs font-semibold",
              "flex items-center justify-center",
              count === 0 ? "hidden" : "",
            ].join(" ")}
            aria-label={`${count} items in cart`}
          >
            {count > 99 ? "99+" : count}
          </span>
          <span className="sr-only">Cart</span>
        </Link>
      </div>
    </header>
  );
}
