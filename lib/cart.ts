// lib/cart.ts
export type CartItem = {
  id: string;            // slug or id as string
  title: string;
  price: number;         // store numeric
  image?: string;
  qty: number;
};

const KEY = "cart.v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  const count = items.reduce((n, it) => n + it.qty, 0);
  window.dispatchEvent(new CustomEvent("cart-update", { detail: { count } }));
}

export function getCartCount(): number {
  return read().reduce((n, it) => n + it.qty, 0);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = read();
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx].qty += qty;
  } else {
    items.push({ ...item, qty });
  }
  write(items);
}

export function removeFromCart(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearCart() {
  write([]);
}
