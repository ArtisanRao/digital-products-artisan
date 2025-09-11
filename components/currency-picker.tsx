"use client";

import * as React from "react";
import { getPreferredCurrency, setPreferredCurrency } from "@/lib/currency";

const LABEL: Record<string, string> = { usd: "USD $", eur: "EUR €", gbp: "GBP £" };

export default function CurrencyPicker({ className }: { className?: string }) {
  const [cur, setCur] = React.useState<string>(() => getPreferredCurrency());

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      setCur(detail || getPreferredCurrency());
    };
    window.addEventListener("currency:change", handler as EventListener);
    return () => window.removeEventListener("currency:change", handler as EventListener);
  }, []);

  return (
    <select
      className={className || "border rounded px-2 py-1 text-sm bg-white"}
      value={cur}
      onChange={(e) => setPreferredCurrency(e.target.value as any)}
      aria-label="Choose currency"
    >
      <option value="usd">{LABEL.usd}</option>
      <option value="eur">{LABEL.eur}</option>
      <option value="gbp">{LABEL.gbp}</option>
    </select>
  );
}
