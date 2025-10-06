// lib/money.ts

// Defaults can be overridden via env (client-side safe NEXT_PUBLIC_* vars)
export const DEFAULT_CURRENCY =
  (process.env.NEXT_PUBLIC_CURRENCY || "USD").toUpperCase();

export const DEFAULT_LOCALE =
  process.env.NEXT_PUBLIC_LOCALE ||
  (DEFAULT_CURRENCY === "EUR" ? "de-DE" : "en-US");

/** Format a number as currency (adds $, €, etc.). */
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  const n = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
  } catch {
    // Safe fallback if locale/currency is invalid
    const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    return `${sym}${n.toFixed(2)}`;
  }
}

// Optional aliases
export const formatMoney = formatCurrency;
export const money = { format: formatCurrency };
