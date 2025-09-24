// lib/cart.ts
"use client";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};
const KEY = "dpa:cart";
export const CART_EVENT = "cart:change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { count: count() } }));
}

export function count(): number { return read().reduce((n, it) => n + it.qty, 0); }

export function add(item: Omit<CartItem, "qty">, qty = 1) {
  const items = read();
  const i = items.findIndex((x) => x.slug === item.slug);
  if (i >= 0) items[i].qty += qty; else items.push({ ...item, qty });
  write(items);
}

export function remove(slug: string, qty = 1) {
  const items = read().map((x) => (x.slug === slug ? { ...x, qty: x.qty - qty } : x)).filter((x) => x.qty > 0);
  write(items);
}

export function clear() { write([]); }

export function onChange(cb: (count: number) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail?.count ?? count());
  window.addEventListener(CART_EVENT, handler);
  return () => window.removeEventListener(CART_EVENT, handler);
}
