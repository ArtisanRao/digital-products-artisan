// lib/cart.ts
export type CartItem = {
  id: string;            // slug or id as string
  title: string;
  price: number;         // numeric (display currency units, e.g., EUR)
  image?: string;
  qty: number;
};

const KEY = "cart.v1";
const EVT = "cart-update"; // primary modern event name (typed payload)

export { EVT as CART_EVENT_NAME };

type CartEventDetail = {
  items: CartItem[];
  count: number;         // total quantity
  total: number;         // sum(price * qty)
};

const isClient = () => typeof window !== "undefined";

/* -------------------- parsing & legacy migration -------------------- */

function coerceItem(it: any): CartItem | null {
  if (!it) return null;
  const id = it.id ?? it.slug ?? it.productId ?? it.key;
  if (id == null) return null;

  const title = String(it.title ?? it.name ?? id);
  const image = it.image ?? (Array.isArray(it.images) && it.images.length ? it.images[0] : undefined);

  // accept price, amount, unit_amount, etc.
  const priceRaw = it.price ?? it.amount ?? it.unit_amount ?? 0;
  const price = Number(priceRaw) || 0;

  // accept qty, quantity
  const qtyRaw = it.qty ?? it.quantity ?? 1;
  const qty = Math.max(1, Number(qtyRaw) || 1);

  return {
    id: String(id),
    title,
    price,
    image: image ? String(image) : undefined,
    qty,
  };
}

function safeParseArray(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map(coerceItem).filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

/** Support older storages: "cart" as map or array, "dpa:cart" etc. */
function readLegacy(): CartItem[] {
  if (!isClient()) return [];
  const ls = window.localStorage;

  // Legacy array under "dpa:cart"
  const legacyArray = safeParseArray(ls.getItem("dpa:cart"));
  if (legacyArray.length) return legacyArray;

  // Legacy map under "cart" -> { key: qty } OR array of items
  const raw = ls.getItem("cart");
  if (raw) {
    try {
      const data = JSON.parse(raw);

      // Map/object { id: qty }
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
        return (data.map(coerceItem).filter(Boolean) as CartItem[]) || [];
      }
    } catch {
      /* ignore */
    }
  }
  return [];
}

function readRaw(): CartItem[] {
  if (!isClient()) return [];
  try {
    const ls = window.localStorage;

    // Preferred modern store
    const current = safeParseArray(ls.getItem(KEY));
    if (current.length) return current;

    // Try to migrate legacy formats
    const legacy = readLegacy();
    if (legacy.length) {
      ls.setItem(KEY, JSON.stringify(legacy));
      try { ls.removeItem("dpa:cart"); } catch {}
      // do NOT remove old "cart" key (could be used elsewhere); leave as-is.
      return legacy;
    }
  } catch {
    // ignore storage errors
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

  // Store first so listeners can read immediately + trigger cross-tab 'storage'
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.localStorage.setItem("cartCount", String(count)); // simple badge
  } catch {
    /* ignore quota errors */
  }

  const detail: CartEventDetail = { items, count, total };

  // Modern event with detail
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
  if (!isClient()) return;
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

export function removeFromCart(id: string) {
  if (!isClient()) return;
  write(readRaw().filter((i) => i.id !== String(id)));
}

export function clearCart() {
  if (!isClient()) return;
  write([]);
}

/**
 * Subscribe to cart changes; returns unsubscribe.
 * Calls handler immediately with the current snapshot.
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

  // Cross-tab updates via localStorage
  const onStorage = (e: StorageEvent) => {
    if (e.key && (e.key === KEY || e.key === "cartCount" || e.key === "cart")) {
      const snap = snapshot(readRaw());
      handler(snap.count, snap);
    }
  };
  window.addEventListener("storage", onStorage);

  // Initialize immediately
  const snap = snapshot(readRaw());
  handler(snap.count, snap);

  return () => {
    window.removeEventListener(EVT, listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------------------- Back-compat aliases ---------------------- */
export const count = getCartCount;
export const getItems = getCart;
export function setItems(items: CartItem[]) {
  write(items ?? []);
}
