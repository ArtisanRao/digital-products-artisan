// components/cart-checkout-button.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context"; // if this is undefined in some pages, keep it
import * as cart from "@/lib/cart";
import { products } from "@/data/products";

type Line = { productId: number; qty: number };

// localStorage keys used across the app (legacy + new)
const LS_KEYS = ["cart.v1", "dpa:cart", "cart"] as const;

function readLocalSnapshot(): Record<string, number> {
  try {
    // prefer new → legacy
    for (const k of LS_KEYS) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") return obj as Record<string, number>;
    }
  } catch {}
  return {};
}

function mapSlugToId(slug: string): number | null {
  const p = products.find(
    (x) =>
      String(x.slug).toLowerCase() === String(slug).toLowerCase() ||
      String(x.id) === slug
  );
  return p?.id != null ? Number(p.id) : null;
}

function buildLinesFromLocal(): Line[] {
  const snap = readLocalSnapshot();
  const lines: Line[] = [];
  for (const key of Object.keys(snap)) {
    const qty = Math.max(1, Number(snap[key] ?? 0) || 0);
    if (!qty) continue;
    let pid: number | null = null;

    if (/^\d+$/.test(key)) pid = Number(key);
    else pid = mapSlugToId(key);

    if (pid != null) lines.push({ productId: pid, qty });
  }
  return lines;
}

function normalizeLines(lines: Line[]): Line[] {
  // coerce qty >= 1, dedupe by productId
  const acc = new Map<number, number>();
  for (const l of lines) {
    const pid = Number(l.productId);
    const qty = Math.max(1, Number(l.qty) || 1);
    if (!Number.isFinite(pid) || !Number.isFinite(qty)) continue;
    acc.set(pid, (acc.get(pid) ?? 0) + qty);
  }
  return Array.from(acc, ([productId, qty]) => ({ productId, qty }));
}

export default function CartCheckoutButton() {
  // Try to read from context if available
  const ctx = (() => {
    try {
      return useCart?.();
    } catch {
      return { items: [] as any[] };
    }
  })();

  const [count, setCount] = useState<number>(() => cart.getCartCount?.() ?? 0);
  const [loading, setLoading] = useState(false);

  // Merge sources for checkout lines
  const lines: Line[] = useMemo(() => {
    // 1) Prefer context items (if populated)
    const ctxItems = Array.isArray(ctx?.items) ? ctx.items : [];
    if (ctxItems.length) {
      const raw = ctxItems.map((it: any) => ({
        productId: Number(it?.id ?? it?.productId ?? it?.product_id),
        qty: Math.max(1, Number(it?.quantity ?? it?.qty ?? 1)),
      }));
      return normalizeLines(raw.filter((r) => Number.isFinite(r.productId)));
    }

    // 2) Try library snapshot if available
    try {
      if (typeof (cart as any).getItems === "function") {
        const libItems = (cart as any).getItems() as Array<{ id: number; qty?: number; quantity?: number }>;
        if (Array.isArray(libItems) && libItems.length) {
          const raw = libItems.map((it) => ({
            productId: Number((it as any).id),
            qty: Math.max(1, Number((it as any).quantity ?? (it as any).qty ?? 1)),
          }));
          return normalizeLines(raw);
        }
      }
    } catch {}

    // 3) localStorage fallback (slug/id → id)
    return normalizeLines(buildLinesFromLocal());
  }, [ctx?.items, count]); // re-run when cart count changes

  // Keep count in sync (lib + legacy + storage)
  useEffect(() => {
    // lib/cart onChange
    const unsub =
      typeof cart.onChange === "function"
        ? cart.onChange((c: number) => setCount(Number(c) || 0))
        : () => {};

    // legacy events (various parts of app may emit)
    const legacyNames = ["cart:updated", "cart:change", "cart-update", "cart:count", "cart:add", "cart:remove"];
    const onLegacy = (e: Event) => {
      const ce = e as CustomEvent<any>;
      const direct = Number(ce?.detail);
      const nested = Number(ce?.detail?.count);
      if (Number.isFinite(direct)) setCount(direct);
      else if (Number.isFinite(nested)) setCount(nested);
      else setCount(cart.getCartCount?.() ?? 0);
    };
    legacyNames.forEach((n) => window.addEventListener(n as any, onLegacy as EventListener));

    // cross-tab
    const onStorage = (e: StorageEvent) => {
      if (!e.key || !(LS_KEYS as readonly string[]).includes(e.key)) return;
      setCount(cart.getCartCount?.() ?? 0);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsub();
      legacyNames.forEach((n) => window.removeEventListener(n as any, onLegacy as EventListener));
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!lines.length) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: lines }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data?.url) {
        console.error("Checkout error:", data);
        alert(data?.error || "Sorry—couldn’t start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch (e) {
      console.error(e);
      alert("Network error starting checkout.");
      setLoading(false);
    }
  }, [lines]);

  return (
    <Button
      onClick={handleCheckout}
      disabled={!lines.length || loading}
      className="bg-gradient-to-r from-blue-600 to-cyan-600"
      aria-disabled={!lines.length || loading}
    >
      {loading ? "Redirecting…" : `Checkout all${count ? ` (${count})` : ""}`}
    </Button>
  );
}

/* ---------------- Optional: clear cart control ---------------- */

export function ClearCartButton({
  children = "Clear cart",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  const clearAll = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const w = window as any;

      // 1) Prefer app-specific carts if available
      if (w?.dpaCart?.clear) try { await w.dpaCart.clear(); } catch {}
      if (w?.__CART__?.clear) try { await w.__CART__.clear(); } catch {}
      if (typeof (cart as any).clear === "function") {
        try { await (cart as any).clear(); } catch {}
      }

      // 2) Always clear local fallbacks
      LS_KEYS.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem("cart", JSON.stringify({}));

      // 3) Announce changes (badges/listeners)
      const n = 0;
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: n } }));
      window.dispatchEvent(new CustomEvent("cart:count", { detail: n }));
      (window as any).__CART_COUNT__ = n;

      // 4) Force re-render in any consumers listening to storage
      window.dispatchEvent(new StorageEvent("storage", { key: "cart", newValue: "{}" }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={clearAll}
      disabled={busy}
      variant="secondary"
      className={className}
      aria-disabled={busy}
    >
      {busy ? "Clearing…" : children}
    </Button>
  );
}
