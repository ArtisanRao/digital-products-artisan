// components/shop/AddToCartButton.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { productsById, products } from "@/data/products";
import * as libcart from "@/lib/cart";

type Size = "sm" | "default" | "lg";

function getProduct(productId: number) {
  return productsById?.[productId] ?? products.find((x) => Number(x.id) === Number(productId));
}

/* ---------- Fallback helpers (only used if libcart is absent) ---------- */
function readMap(): Record<string, number> {
  try {
    for (const k of ["cart.v1", "dpa:cart"]) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object" && !Array.isArray(obj)) return obj as Record<string, number>;
    }
  } catch {}
  return {};
}
function writeMap(map: Record<string, number>) {
  try {
    localStorage.setItem("cart.v1", JSON.stringify(map));
    localStorage.setItem("dpa:cart", JSON.stringify(map)); // mirror
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
  try {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
    window.dispatchEvent(new CustomEvent("cart:count", { detail: count }));
  } catch {}
  // Plain DOM badge (non-React areas)
  const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
  if (badge) badge.textContent = String(count);
}
/* ---------------------------------------------------------------------- */

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

    // Prefer slug for id; fallback to numeric id
    const id = String(p.slug ?? p.id);
    const image = (Array.isArray(p.images) && p.images.length ? p.images[0] : undefined) ?? p.image;
    const title = p.title;
    const price = Number(p.price) || 0;

    let handledByLib = false;

    // 1) Primary: lib/cart (authoritative, emits events, updates badge)
    try {
      if (libcart && typeof (libcart as any).addToCart === "function") {
        (libcart as any).addToCart({ id, title, price, image }, 1);
        handledByLib = true;
      } else if (libcart && typeof (libcart as any).add === "function") {
        (libcart as any).add(id, 1, { title, price, image });
        handledByLib = true;
      }
    } catch {
      handledByLib = false;
    }

    if (handledByLib) {
      // libcart already emitted events + updated badge. We can still nudge SR/UX.
      try { navigator?.vibrate?.(10); } catch {}
      return;
    }

    // 2) Fallback path (legacy localStorage formats)
    //    Keep map stores (cart.v1/dpa:cart) + legacy array "cart" in sync.
    const map = readMap();
    map[id] = Math.max(0, Number(map[id] ?? 0)) + 1;
    writeMap(map);

    const arr = readLegacyArray();
    const found = arr.find((i) => String(i.id) === String(p.id));
    if (found) {
      const current = Math.max(1, Number(found.quantity ?? found.qty ?? 1));
      const next = current + 1;
      found.quantity = next;
      found.qty = next; // mirror for older UIs
    } else {
      arr.push({
        id: String(p.id),
        name: title,
        price,
        quantity: 1,
        qty: 1,
        image,
        url: `/products/${encodeURIComponent(String(p.slug ?? p.id))}`,
        description: p.description,
      });
    }
    writeLegacyArray(arr);

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
