"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export function SiteHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("cart");
        const items = raw ? JSON.parse(raw) : [];
        const c = Array.isArray(items)
          ? items.reduce((n: number, i: any) => n + Number(i?.quantity || 1), 0)
          : 0;
        setCount(c);
        localStorage.setItem("cartCount", String(c));
      } catch {}
    };

    read(); // on mount

    const onUpdate = (e: Event) => {
      const d = (e as CustomEvent<{ count?: number; items?: any[] }>).detail;
      if (d?.count != null) setCount(d.count);
      else read();
    };

    window.addEventListener("cart:updated", onUpdate as EventListener);
    return () => window.removeEventListener("cart:updated", onUpdate as EventListener);
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
