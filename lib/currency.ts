// lib/currency.ts
const KEY = "preferredCurrency"; // "usd" | "eur"

export function getPreferredCurrency(): "usd" | "eur" {
  if (typeof window === "undefined") return "usd";
  const v = (localStorage.getItem(KEY) || "usd").toLowerCase();
  return v === "eur" ? "eur" : "usd";
}

export function setPreferredCurrency(v: string) {
  if (typeof window === "undefined") return;
  const val = (v || "").toLowerCase() === "eur" ? "eur" : "usd";
  localStorage.setItem(KEY, val);
  // let listeners (cart, buy-now button) react immediately
  window.dispatchEvent(new CustomEvent("currency:change", { detail: val }));
}
