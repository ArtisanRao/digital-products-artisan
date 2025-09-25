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

  const { count, total } = snapshot(items);

  // Store first so listeners can read immediately
  window.localStorage.setItem(KEY, JSON.stringify(items));
  // Keep a simple 'cartCount' for UIs that only need a badge
  try { window.localStorage.setItem("cartCount", String(count)); } catch {}

  const detail: CartEventDetail = { items, count, total };

  // Modern event (typed payload)
  try { window.dispatchEvent(new CustomEvent<CartEventDetail>(EVT, { detail })); } catch {}

  // Back-compat events many components already listen to
  try { window.dispatchEvent(new Event("cart:change")); } catch {}
  try { window.dispatchEvent(new Event("cart-update")); } catch {}
  try { window.dispatchEvent(new CustomEvent("cart:updated", { detail })); } catch {}
  try { window.dispatchEvent(new CustomEvent("cart:count", { detail: count })); } catch {}
  if (added) {
    try { window.dispatchEvent(new CustomEvent("cart:add", { detail: added })); } catch {}
  }
}

function write(items: CartItem[], added?: CartItem) {
  emit(items, added);
}

/* --------------------------- Public API --------------------------- */

export function getCart(): CartItem[] {
  return [...readRaw()];
}

export function getCartCount(): number {
  return readRaw().reduce((n, it) => n + it.qty, 0);
}

export function getCartTotal(): number {
  return readRaw().reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
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

export function setQty(id: string, qty: number) {
  const items = readRaw();
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx < 0) return;
  const q = Math.floor(qty);
  if (q <= 0) items.splice(idx, 1);
  else items[idx].qty = q;
  write(items);
}

export function increment(id: string, by = 1) {
  const items = readRaw();
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx < 0) return;
  const next = (items[idx].qty || 0) + Math.floor(by);
  if (next <= 0) items.splice(idx, 1);
  else items[idx].qty = next;
  write(items);
}

export function removeFromCart(id: string) {
  write(readRaw().filter((i) => i.id !== String(id)));
}

export function clearCart() {
  write([]);
}

/** Subscribe to cart changes; returns unsubscribe. */
export function onChange(
  handler: (count: number, detail: CartEventDetail) => void
): () => void {
  const listener = (ev: Event) => {
    const ce = ev as CustomEvent<CartEventDetail>;
    const detail = ce.detail ?? snapshot(readRaw());
    handler(detail.count, detail);
  };
  window.addEventListener(EVT, listener);
  // Initialize immediately
  const snap = snapshot(readRaw());
  handler(snap.count, snap);
  return () => window.removeEventListener(EVT, listener);
}

/* ---------------------- Back-compat aliases ---------------------- */
export const count = getCartCount;
export const getItems = getCart;
export function setItems(items: CartItem[]) {
  write(items ?? []);
}
