"use client";

import { useEffect } from "react";

type Props = { paramName?: string; allowed?: string[] };

export default function ForceCurrencyFromQuery({
  paramName = "currency",
  allowed = ["USD", "EUR", "GBP"],
}: Props) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get(paramName);
    if (!raw) return;
    const wanted = raw.toUpperCase();
    if (!allowed.includes(wanted)) return;

    // persist preference the same way your site already does
    try {
      localStorage.setItem("preferredCurrency", wanted);
      window.dispatchEvent(new CustomEvent("currency:change", { detail: { currency: wanted } }));
    } catch {}
  }, [paramName, allowed]);

  return null;
}
