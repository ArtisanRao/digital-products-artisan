"use client";

import { useEffect, useState } from "react";

export function useCartCount() {
  const [count, setCount] = useState(0);

  const recompute = () => {
    try {
      const raw = localStorage.getItem("cart");
      const total = raw
        ? Object.values(JSON.parse(raw) as Record<string, number>).reduce((a, b) => a + Number(b), 0)
        : 0;
      setCount(total);
    } catch {}
  };

  useEffect(() => {
    recompute();
    const onAdd = (e: Event) => recompute();
    const onCount = (e: any) => setCount(e?.detail ?? 0);
    const onStorage = (e: StorageEvent) => { if (e.key === "cart") recompute(); };

    window.addEventListener("cart:add", onAdd as EventListener);
    window.addEventListener("cart:count", onCount as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:add", onAdd as EventListener);
      window.removeEventListener("cart:count", onCount as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return count;
}
