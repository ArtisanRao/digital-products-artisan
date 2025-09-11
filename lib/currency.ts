// lib/currency.ts
export type CurrencyCode = "usd" | "eur" | "gbp";
const KEY = "preferred_currency";

const ALLOWED: CurrencyCode[] = ["usd", "eur", "gbp"];

export function getPreferredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "usd";
  const v = (localStorage.getItem(KEY) || "").toLowerCase();
  return (ALLOWED.includes(v as CurrencyCode) ? v : "usd") as CurrencyCode;
}

export function setPreferredCurrency(code: CurrencyCode) {
  if (typeof window === "undefined") return;
  const norm = (code || "usd").toLowerCase();
  const safe = (ALLOWED.includes(norm as CurrencyCode) ? norm : "usd") as CurrencyCode;
  localStorage.setItem(KEY, safe);
  // notify listeners so UIs can refresh
  window.dispatchEvent(new CustomEvent("currency:change", { detail: safe }));
}
