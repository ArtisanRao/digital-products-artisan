// components/currency-bootstrap.tsx
"use client";

import { useEffect } from "react";
import { getPreferredCurrency, setPreferredCurrency } from "@/lib/currency";

/**
 * Runs once on first visit:
 * - If user has no stored currency, fetch a server hint (IP-based)
 * - Persist it in localStorage and broadcast `currency:change`
 * No UI, fully invisible.
 */
export default function CurrencyBootstrap({
  fallback = "usd",
}: { fallback?: "usd" | "eur" }) {
  useEffect(() => {
    const current = getPreferredCurrency();
    if (current) return; // already chosen or set

    (async () => {
      try {
        const r = await fetch("/api/currency-suggest", { cache: "no-store" });
        const j = await r.json();
        const c = j?.currency === "eur" ? "eur" : fallback;
        setPreferredCurrency(c);
        window.dispatchEvent(new CustomEvent("currency:change", { detail: c }));
      } catch {
        setPreferredCurrency(fallback);
        window.dispatchEvent(new CustomEvent("currency:change", { detail: fallback }));
      }
    })();
  }, [fallback]);

  return null;
}
