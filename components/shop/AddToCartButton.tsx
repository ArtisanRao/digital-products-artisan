// components/shop/AddToCartButton.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { productsById, products } from "@/data/products";
// If your project has this helper, we’ll use it; if not, you can remove these two lines.
import * as libcart from "@/lib/cart";

type Size = "sm" | "default" | "lg";

const LS_KEYS = ["cart.v1", "dpa:cart", "cart"] as const;

function getProduct(productId: number) {
  return productsById?.[productId] ?? products.find((x) => Number(x.id) === Number(productId));
}

function readMap(): Record<string, number> {
  try {
    for (const k of ["cart.v1", "dpa:cart"]) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") return obj as Record<string, number>;
    }
  } catch {}
  return {};
}

function writeMap(map: Record<string, number>) {
  try {
    localStorage.setItem("cart.v1", JSON.stringify(map));
    localStorage.setItem("dpa:cart", JSON.stringify(map)); // keep both in sync
  } catch {}
}

function readLegacyArray(): any[] {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? (JSON.parse(raw) as any[]) : [];
  } catch {
    return [];
  }
}

function writeLegacyArray(arr: any[]) {
  try {
    localStorage.setItem("cart", JSON.stringify(arr));
  } catch {}
}

function countFromMap(map: Record<string, number>) {
  return Object.values(map).reduce((a, b) => a + Math.max(0, Number(b) || 0), 0);
}

function announce(count: number, items?: any) {
  // Events for React and non-React listeners
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
  window.dispatchEvent(new CustomEvent("cart:count", { detail: count }));
  (window as any).__CART_COUNT__ = count;

  // Progressive enhancement for plain DOM badges
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (badge) badge.textContent = String(count);
}

export default function AddToCartButton({
  productId,
  size = "default",
  className = "",
  children,
}: {
  productId: number;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}) {
  const [adding, setAdding] = React.useState(false);

  const add = React.useCallback(() => {
    const p = getProduct(productId);
    if (!p) return;

    // Prefer slug for keys; fallback to numeric id
    const key = String(p.slug ?? p.id);
    const idStr = String(p.id);

    // 1) Vendor / app carts if available
    const w = window as any;
    try { if (w?.dpaCart?.add) w.dpaCart.add({ slug: key, qty: 1 }); } catch {}
    try { if (w?.__CART__?.add) w.__CART__.add({ slug: key, qty: 1 }); } catch {}

    // 2) Library cart (if your project exposes it)
    try { if (typeof (libcart as any).add === "function") (libcart as any).add(key, 1); } catch {}

    // 3) LocalStorage map format (cart.v1 / dpa:cart)
    const map = readMap();
    map[key] = Math.max(0, Number(map[key] ?? 0)) + 1;
    writeMap(map);

    // 4) Legacy array format (cart)
    const arr = readLegacyArray();
    const found = arr.find((i) => String(i.id) === idStr);
    if (found) {
      const current = Math.max(1, Number(found.quantity ?? found.qty ?? 1));
      const next = current + 1;
      found.quantity = next;
      found.qty = next; // legacy mirror
    } else {
      arr.push({
        id: idStr,
        name: p.title,
        price: p.price,
        quantity: 1,
        qty: 1, // legacy support
        image: (Array.isArray(p.images) ? p.images[0] : undefined) ?? p.image,
        url: `/products/${encodeURIComponent(String(p.slug ?? p.id))}`,
        description: p.description,
      });
    }
    writeLegacyArray(arr);

    // 5) Count + announce
    const count = countFromMap(map) || arr.reduce((n, i) => n + Math.max(1, Number(i?.quantity ?? i?.qty ?? 1) || 1), 0);
    announce(count, arr);

    try { navigator?.vibrate?.(10); } catch {}
  }, [productId]);

  const handleClick = async () => {
    if (adding) return;
    setAdding(true);
    try {
      add();
    } finally {
      setAdding(false);
    }
  };

  const base =
    "gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <Button
      onClick={handleClick}
      disabled={adding}
      size={size}
      className={`${base} ${className}`}
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-4 h-4 mr-2 text-white" />
      {adding ? "Adding…" : children ?? "Add to cart"}
    </Button>
  );
}
