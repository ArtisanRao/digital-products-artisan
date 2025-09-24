"use client";

const KEY = "dpa_cart_v1";

type CartItem = { slug: string; title: string; price: number; image?: string; qty: number };

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:change")); // notify listeners (badge)
}

export function get(): CartItem[] {
  return load();
}

export function count(): number {
  return load().reduce((n, it) => n + it.qty, 0);
}

export function add(base: { slug: string; title: string; price: number; image?: string }, qty = 1) {
  const items = load();
  const i = items.findIndex((it) => it.slug === base.slug);
  if (i >= 0) items[i].qty += qty;
  else items.push({ ...base, qty });
  save(items);
}

export function onChange(handler: (count: number) => void) {
  const cb = () => handler(count());
  window.addEventListener("cart:change", cb);
  return () => window.removeEventListener("cart:change", cb);
}
