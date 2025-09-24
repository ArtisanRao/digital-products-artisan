// lib/cart.ts

export type CartItem = {
  id: string;            // slug or id as string
  title: string;
  price: number;         // numeric (in display currency units, e.g., EUR)
  image?: string;
  qty: number;
};

const KEY = "cart.v1";
const EVT = "cart-update";

type CartEventDetail = {
  items: CartItem[];
  count: number;         // total quantity
  total: number;         // sum(price * qty)
};

const isClient = () => typeof window !== "undefined";

function safeParse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(arr)) return [];
    // sanitize
    return arr
      .filter(Boolean)
      .map((it) => ({
        id: String(it.id),
        title: String(it.title ?? ""),
        price: Number(it.price) || 0,
        image: it.image ? String(it.image) : undefined,
        qty: Math.max(1, Number(it.qty) || 1),
      }));
  } catch {
    return [];
  }
}

function read(): CartItem[] {
  if (!isClient()) return [];
  return safeParse(window.localStorage.getItem(KEY));
}

function snapshot(items: CartItem[]) {
  const count = items.reduce((n, it) => n + (Number(it.qty) || 0), 0);
  const total = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  return { items, count, total };
}

function emit(items: CartItem[]) {
  if (!isClient()) return;
  const { count, total } = snapshot(items);
  // Store first so listeners can read immediately
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(
    new CustomEvent<CartEventDetail>(EVT, { detail: { items, count, total } })
  );
}

function write(items: CartItem[]) {
  if (!isClient()) return;
  emit(items);
}

// ---------- Public API ----------

/** Read a *copy* of the cart array. */
export function getCart(): CartItem[] {
  return [...read()];
}

/** Total item count (badge). */
export function getCartCount(): number {
  return read().reduce((n, it) => n + it.qty, 0);
}

/** Total price (price * qty). */
export function getCartTotal(): number {
  return read().reduce((sum, it) => sum + it.price * it.qty, 0);
}

/** Add item (merges by id). */
export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  if (!isClient()) return;
  const items = read();
  const q = Math.max(1, Math.floor(qty));
  const price = Number(item.price) || 0;

  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx].qty += q;
    // keep title/price/image fresh
    items[idx].title = item.title;
    items[idx].price = price;
    items[idx].image = item.image ?? items[idx].image;
  } else {
    items.push({ ...item, price, qty: q });
  }
  write(items);
}

/** Set exact quantity; qty <= 0 removes the item. */
export function setQty(id: string, qty: number) {
  if (!isClient()) return;
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return;
  const q = Math.floor(qty);
  if (q <= 0) {
    items.splice(idx, 1);
  } else {
    items[idx].qty = q;
  }
  write(items);
}

/** Increment or decrement by `by`. Removes if <= 0. */
export function increment(id: string, by = 1) {
  if (!isClient()) return;
  const items = read();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return;
  const next = (items[idx].qty || 0) + Math.floor(by);
  if (next <= 0) items.splice(idx, 1);
  else items[idx].qty = next;
  write(items);
}

/** Remove one line by id. */
export function removeFromCart(id: string) {
  if (!isClient()) return;
  write(read().filter((i) => i.id === id ? false : true));
}

/** Clear all items. */
export function clearCart() {
  if (!isClient()) return;
  write([]);
}

/**
 * Subscribe to cart changes.
 * Returns an unsubscribe function.
 * The handler gets (count, detail) where detail includes items & total.
 */
export function onChange(
  handler: (count: number, detail: CartEventDetail) => void
): () => void {
  if (!isClient()) return () => {};
  const listener = (ev: Event) => {
    const ce = ev as CustomEvent<CartEventDetail>;
    // When invoked before any write, synthesize current detail
    const detail = ce.detail ?? snapshot(read());
    handler(detail.count, detail);
  };
  window.addEventListener(EVT, listener);
  // Fire once with current state so badges can initialize
  const init = snapshot(read());
  handler(init.count, init);
  return () => window.removeEventListener(EVT, listener);
}

// ---------- Back-compat aliases (older components) ----------
/** Alias for getCartCount() */
export const count = getCartCount;
/** Alias for getCart() */
export const getItems = getCart;
/** Imperative setter (use with care) */
export function setItems(items: CartItem[]) {
  write(items ?? []);
}
