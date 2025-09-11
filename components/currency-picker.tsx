// components/currency-picker.tsx
"use client";

import { useEffect } from "react";
import { getPreferredCurrency, setPreferredCurrency } from "@/lib/currency";

/**
 * Invisible placeholder. Keeps backward compatibility if Header still renders <CurrencyPicker />.
 * We ensure a stored currency exists, but render no UI.
 */
export default function CurrencyPicker() {
  useEffect(() => {
    const v = getPreferredCurrency();
    if (!v) setPreferredCurrency("usd");
  }, []);
  return null; // 👈 no visible control
}
