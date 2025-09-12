"use client";

import { useEffect } from "react";
import { setPreferredCurrency } from "@/lib/currency";

/**
 * Sets a default currency once per browser (EUR for EU IPs, else USD),
 * without showing a picker. It won't overwrite a user’s existing choice.
 */
export default function AutoCurrency() {
  useEffect(() => {
    // Do not overwrite if user already has a currency saved
    try {
      const existing = localStorage.getItem("currency");
      if (existing) return;
    } catch {
      // ignore
    }

    (async () => {
      try {
        // Ask the server what country it saw for this request (from edge headers)
        const res = await fetch("/api/checkout?diag=1", { cache: "no-store" });
        const j = await res.json();
        const iso2 = String(j?.seenCountry || "").toUpperCase();

        const EU = new Set([
          "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
          "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
        ]);

        const currency = EU.has(iso2) ? "eur" : "usd";
        setPreferredCurrency(currency as "eur" | "usd");
      } catch {
        // Last-resort heuristic if diag route fails
        const currency =
          (navigator.language || "").toLowerCase().includes("-") &&
          /(de|fr|it|es|nl|pt|fi|sv|da|pl|cs|sk|sl|hr|hu|el|et|lv|lt)/
            .test(navigator.language.toLowerCase())
            ? "eur"
            : "usd";
        setPreferredCurrency(currency as "eur" | "usd");
      }
    })();
  }, []);

  return null;
}
