// lib/cart.ts

export type CartItem = {
  id: string;            // slug or id as string
  title: string;
  price: number;         // numeric (display currency units, e.g., EUR)
  image?: string;
  qty: number;
};

const KEY = "cart.v1";
const EVT = "cart-update"; // primary modern event

type CartEventDetail = {
  items: CartItem[];
  count: number;         // total quantity
  total: number;         // sum(price * qty)
};

const isClient = () => typeof window !== "undefined";

/* -------------------- parsing & legacy migration -------------------- */

function safeParseArray(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(Boolean)
      .map((it: any) => ({
        id: String(it.id),
        title: String(it.title ?? ""),
        price: Number(it.price) || 0,
        image: it?.image ? String(it.image) : undefined,
        qty: Math.max(1, Number(it.qty) || 1),
      }));
  } catch {
    return [];
  }
}

/** Support older storages: "cart" as map or array, "dpa:cart" etc. */
function readLegacy(): CartItem[] {
  const w = window as any;
  const ls = w?.localStorage as Storage | undefined;
  if (!ls) return [];

  // Legacy array under "dpa:cart"
  const legacyArray = safeParseArray(ls.getItem("dpa:cart"));
  if (legacyArray.length) return legacyArray;

  // Legacy map under "cart" -> { key: qty }
  const raw = ls.getItem("cart");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      // Map/object
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const items: CartItem[] = Object.entries(data).map(([k, v]) => ({
          id: String(k),
          title: String(k),
          price: 0,
          qty: Math.max(1, Number(v) || 1),
        }));
        return items;
      }
      // Array that looks like items
      if (Array.isArray(data)) {
        return safeParseArray(raw);
      }
    } catch {
      /* ignore */
    }
  }
  return [];
}

function readRaw(): CartItem[] {
  if (!isClient()) return [];
  const ls = window.localStorage;

  // Preferred modern store
  const current = safeParseArray(ls.getItem(KEY));
  if (current.length) return current;

  // Try to migrate legacy formats
  const legacy = readLegacy();
  if (legacy.length) {
    // Save as modern and remove obvious legacy keys
    ls.setItem(KEY, JSON.stringify(legacy));
    try { ls.removeItem("dpa:cart"); } catch {}
    // do NOT remove old "cart" key (could be used elsewhere); leave as-is.
    return legacy;
  }

  return [];
}

function snapshot(items: CartItem[]) {
  const count = items.reduce((n, it) => n + (Number(it.qty) || 0), 0);
  const total = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );
  return { items, count, total };
}

function emit(items: CartItem[], added?: CartItem) {
  if (!isClient()) return;

  // Store first so listeners can read immediately
  window.localStorage.setItem(KEY, JSON.stringify(items));

  const { count, total } = snapshot(items);
  const detail: CartEventDetail = { items, count, total };

  // Modern event (typed payload)
  try {
    window.dispatchEvent(new CustomEvent<CartEventDetail>(EVT, { detail }));
  } catch {}

  // Back-compat events many components already listen to
  try { window.dispatchEvent(new Event("cart:change")); } catch {}
  try { window.dispatchEvent(new Event("cart-update")); } catch {}
  try { window.dispatchEvent(new CustomEvent("cart:count", { detail: count })); } catch {}
  if (added) {
    try { window.dispatchEvent(new CustomEvent("cart:add", { detail: added })); } catch {}
  }
}

function write(items: CartItem[], added?: CartItem) {
  if (!isClient()) return;
  emit(items, added);
}

/* --------------------------- Public API --------------------------- */

/** Read a *copy* of the cart array. */
export function getCart(): CartItem[] {
  return [...readRaw()];
}

/** Total item count (badge). */
export function getCartCount(): number {
  return readRaw().reduce((n, it) => n + it.qty, 0);
}

/** Total price (price * qty). */
export function getCartTotal(): number {
  return readRaw().reduce((sum, it) => sum + it.price * it.qty, 0);
}

/** Add item (merges by id). */
export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  if (!isClient()) return;
  const items = readRaw();
  const q = Math.max(1, Math.floor(qty));
  const price = Number(item.price) || 0;

  const idx = items.findIndex((i) => i.id === String(item.id));
  let added: CartItem | undefined;

  if (idx >= 0) {
    items[idx].qty += q;
    items[idx].title = item.title;
    items[idx].price = price;
    items[idx].image = item.image ?? items[idx].image;
    added = { ...items[idx] };
  } else {
    added = { ...item, id: String(item.id), price, qty: q };
    items.push(added);
  }
  write(items, added);
}

/** Set exact quantity; qty <= 0 removes the item. */
export function setQty(id: string, qty: number) {
  if (!isClient()) return;
  const items = readRaw();
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx < 0) return;
  const q = Math.floor(qty);
  if (q <= 0) items.splice(idx, 1);
  else items[idx].qty = q;
  write(items);
}

/** Increment or decrement by `by`. Removes if <= 0. */
export function increment(id: string, by = 1) {
  if (!isClient()) return;
  const items = readRaw();
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx < 0) return;
  const next = (items[idx].qty || 0) + Math.floor(by);
  if (next <= 0) items.splice(idx, 1);
  else items[idx].qty = next;
  write(items);
}

/** Remove one line by id. */
export function removeFromCart(id: string) {
  if (!isClient()) return;
  write(readRaw().filter((i) => i.id !== String(id)));
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
    const detail = ce.detail ?? snapshot(readRaw());
    handler(detail.count, detail);
  };
  window.addEventListener(EVT, listener);
  // Initialize immediately
  handler(...((() => {
    const snap = snapshot(readRaw());
    return [snap.count, snap] as const;
  })()));
  return () => window.removeEventListener(EVT, listener);
}

/* ---------------------- Back-compat aliases ---------------------- */
export const count = getCartCount;
export const getItems = getCart;
export function setItems(items: CartItem[]) {
  write(items ?? []);
}
