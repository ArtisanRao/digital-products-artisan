// lib/currency.ts
const KEY = "preferredCurrency"; // "usd" | "eur"

// Minimal EU language hints for a sensible default when no preference is saved
const EU_LANG_PREFIXES = [
  "de", "fr", "es", "it", "nl", "pt", "fi", "sv", "da", "no", "pl", "cs", "sk", "hu", "ro", "bg",
  "hr", "sl", "lt", "lv", "et", "el", "mt", "ga", "cy"
];

type Currency = "usd" | "eur";

function normalize(v: unknown): Currency {
  return String(v).toLowerCase() === "eur" ? "eur" : "usd";
}

function guessFromLocale(): Currency {
  try {
    const lang = (typeof navigator !== "undefined" && navigator.language) || "";
    const lc = lang.toLowerCase();
    if (EU_LANG_PREFIXES.some((p) => lc.startsWith(p))) return "eur";
  } catch {}
  return "usd";
}

/**
 * Read the preferred currency.
 * Order of precedence:
 *   1) localStorage "preferredCurrency"
 *   2) Browser locale hint (EU → "eur")
 *   3) Fallback "usd"
 *
 * SSR-safe: returns "usd" on the server.
 */
export function getPreferredCurrency(): Currency {
  if (typeof window === "undefined") return "usd"; // SSR default; server also decides
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved) return normalize(saved);
  } catch {}
  return guessFromLocale();
}

/**
 * Persist the preferred currency and broadcast a change event.
 * Any component can subscribe via `onCurrencyChange`.
 */
export function setPreferredCurrency(v: string) {
  if (typeof window === "undefined") return;
  const val = normalize(v);
  try {
    window.localStorage.setItem(KEY, val);
  } catch {}
  // Notify listeners (cart badge, Buy button, etc.)
  try {
    window.dispatchEvent(new CustomEvent<Currency>("currency:change", { detail: val }));
  } catch {}
}

/**
 * Subscribe to currency changes.
 * Returns an unsubscribe function you should call on cleanup.
 */
export function onCurrencyChange(handler: (currency: Currency) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<Currency>).detail;
    // If no detail, recompute
    handler(detail ?? getPreferredCurrency());
  };
  window.addEventListener("currency:change", listener as EventListener);
  return () => window.removeEventListener("currency:change", listener as EventListener);
}

// no-op: trigger deploy 2025-09-20T01:34:49
