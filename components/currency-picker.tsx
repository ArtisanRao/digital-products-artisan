"use client";
import { useEffect, useState } from "react";
import { getPreferredCurrency, setPreferredCurrency } from "@/lib/currency";

export default function CurrencyPicker({ className }: { className?: string }) {
  const [cur, setCur] = useState<"usd"|"eur">("usd");

  useEffect(() => setCur(getPreferredCurrency()), []);

  return (
    <select
      aria-label="Currency"
      value={cur}
      onChange={(e) => { const v = e.target.value as "usd"|"eur"; setCur(v); setPreferredCurrency(v); }}
      className={className ?? "border rounded px-2 py-1 text-sm"}
    >
      <option value="usd">USD $</option>
      <option value="eur">EUR €</option>
    </select>
  );
}
