export type Currency = "usd" | "eur";

const KEY = "currency";

export function getPreferredCurrency(): Currency {
  if (typeof window === "undefined") return "usd";
  const v = (localStorage.getItem(KEY) || "").toLowerCase();
  return v === "eur" ? "eur" : "usd";
}

export function setPreferredCurrency(c: string) {
  try {
    const v = (c || "").toLowerCase();
    localStorage.setItem(KEY, v === "eur" ? "eur" : "usd");
  } catch {}
}

// Back-compat aliases
export const readSelectedCurrency = getPreferredCurrency;
export const getSelectedCurrency = getPreferredCurrency;
