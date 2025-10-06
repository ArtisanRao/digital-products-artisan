// lib/cart.ts
import { productsBySlug, productsById, type Product } from "@/data/products"

export type CartItem = {
  id: string;            // slug or id as string
  title: string;
  price: number;         // numeric (display currency units, e.g., EUR)
  image?: string;
  qty: number;
};

const KEY = "cart.v1";
const LEGACY_ARRAY_KEY = "cart";      // could be array OR map
const LEGACY_MAP_KEY   = "dpa:cart";  // could be map OR array in older builds
const COUNT_KEY = "cartCount";

// Useful for badge/cross-tab listeners elsewhere
export const LS_KEYS = [KEY, LEGACY_ARRAY_KEY, LEGACY_MAP_KEY, COUNT_KEY] as const;

const EVT = "cart-update"; // primary modern event name (typed payload)
export { EVT as CART_EVENT_NAME };

type CartEventDetail = {
  items: CartItem[];
  count: number;         // total quantity
  total: number;         // sum(price * qty)
};

const isClient = () => typeof window !== "undefined";

/* -------------------- catalog helpers -------------------- */

function productFromCatalog(key: string | number | null | undefined): Product | undefined {
  if (key == null) return undefined;
  const s = String(key);
  // Try slug
  if (productsBySlug[s]) return productsBySlug[s];
  // Try numeric id
  const n = Number(s);
  if (Number.isFinite(n) && productsById[n]) return productsById[n];
  return undefined;
}

function enrichFromCatalog<T extends Partial<CartItem>>(idLike: string, base: T): T & Partial<CartItem> {
  const p = productFromCatalog(idLike);
  if (!p) return base;
  return {
    ...base,
    title: base.title ?? p.title,
    price: typeof base.price === "number" && base.price > 0 ? base.price : p.price,
    // parenthesized to avoid mixing ?? with ||
    image: base.image ?? p.image ?? ((Array.isArray(p.images) && p.images[0]) || base.image),
  };
}

/* -------------------- parsing & legacy migration -------------------- */

function coerceItem(it: any): CartItem | null {
  if (!it) return null;
  const id = it.id ?? it.slug ?? it.productId ?? it.key;
  if (id == null) return null;

  let title = String(it.title ?? it.name ?? id);
  let image = it.image ?? (Array.isArray(it.images) && it.images.length ? it.images[0] : undefined);

  // accept price, amount, unit_amount, etc.
  const priceRaw = it.price ?? it.amount ?? it.unit_amount ?? 0;
  let price = Number(priceRaw) || 0;

  // accept qty, quantity
  const qtyRaw = it.qty ?? it.quantity ?? 1;
  const qty = Math.max(1, Number(qtyRaw) || 1);

  // If missing/zero price or missing image/title, enrich from catalog
  const enriched = enrichFromCatalog(String(id), { title, price, image });
  title = String(enriched.title ?? title);
  price = Number(enriched.price ?? price) || 0;
  image = enriched.image;

  return {
    id: String(id),
    title,
    price,
    image: image ? String(image) : undefined,
    qty,
  };
}

function safeParse(raw: string | null): any {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function safeParseArray(raw: string | null): CartItem[] {
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(coerceItem).filter(Boolean) as CartItem[];
}

/** Normalize a map-like object { key: qty } into CartItem[] (title = key, price resolved via catalog if possible) */
function mapToItems(obj: any): CartItem[] {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
  return Object.entries(obj).map(([k, v]) => {
    const base: CartItem = {
      id: String(k),
      title: String(k),
      price: 0,
      qty: Math.max(1, Number(v) || 1),
    };
    const enriched = enrichFromCatalog(String(k), base);
    return {
      ...base,
      title: String(enriched.title ?? base.title),
      price: Number(enriched.price ?? base.price) || 0,
      image: enriched.image ?? base.image,
    };
  });
}

/** Support older storages: "cart" and "dpa:cart" may be map or array */
function readLegacy(): CartItem[] {
  if (!isClient()) return [];
  const ls = window.localStorage;

  // Try dpa:cart first (older builds sometimes stored array here, newer code stored map)
  const dpaRaw = ls.getItem(LEGACY_MAP_KEY);
  if (dpaRaw) {
    const dpaParsed = safeParse(dpaRaw);
    if (Array.isArray(dpaParsed)) {
      const arr = (dpaParsed.map(coerceItem).filter(Boolean) as CartItem[]);
      if (arr.length) return arr;
    } else if (dpaParsed && typeof dpaParsed === "object") {
      const arr = mapToItems(dpaParsed);
      if (arr.length) return arr;
    }
  }

  // "cart" may be {id: qty} OR array of items
  const raw = ls.getItem(LEGACY_ARRAY_KEY);
  if (raw) {
    const parsed = safeParse(raw);
    if (Array.isArray(parsed)) {
      return (parsed.map(coerceItem).filter(Boolean) as CartItem[]) || [];
    }
    if (parsed && typeof parsed === "object") {
      return mapToItems(parsed);
    }
  }

  return [];
}

function readRaw(): CartItem[] {
  if (!isClient()) return [];
  try {
    const ls = window.localStorage;

    // Preferred modern store (array of CartItem)
    const current = safeParseArray(ls.getItem(KEY));
    if (current.length) return current;

    // Try to migrate legacy formats
    const legacy = readLegacy();
    if (legacy.length) {
      // write modern
      ls.setItem(KEY, JSON.stringify(legacy));
      // mirror to map for maximum compatibility
      mirrorToMap(legacy);
      return legacy;
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

function snapshot(items: CartItem[]) {
  const count = items.reduce((n, it) => n + (Number(it.qty) || 0), 0);
  const total = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  return { items, count, total };
}

/** Mirror array → map under dpa:cart for codepaths expecting { key: qty } */
function mirrorToMap(items: CartItem[]) {
  try {
    const map: Record<string, number> = {};
    for (const it of items) {
      const id = String(it.id);
      const qty = Math.max(1, Number(it.qty) || 1);
      map[id] = (map[id] ?? 0) + qty;
    }
    window.localStorage.setItem(LEGACY_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Update visible badges that don't use React */
function updateDomBadge(count: number) {
  try {
    const badge = document.querySelector<HTMLElement>("[data-cart-badge]");
    if (badge) badge.textContent = String(count);
  } catch {
    /* ignore */
  }
}

function emit(items: CartItem[], added?: CartItem) {
  if (!isClient()) return;

  const { count, total } = snapshot(items);

  // Store modern first so listeners can read immediately; trigger cross-tab 'storage'
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.localStorage.setItem(COUNT_KEY, String(count)); // simple badge
    mirrorToMap(items); // keep the map mirror in sync
  } catch {
    /* ignore quota errors */
  }

  const detail: CartEventDetail = { items, count, total };

  // Modern typed event (cast detail for TS)
  try {
    window.dispatchEvent(new CustomEvent(EVT, { detail } as CustomEventInit<CartEventDetail>));
  } catch {}

  // Back-compat events many components already listen to
  try { window.dispatchEvent(new Event("cart:change")); } catch {}
  try { window.dispatchEvent(new Event("cart-update")); } catch {}
  try { window.dispatchEvent(new CustomEvent("cart:updated", { detail })); } catch {}
  try { window.dispatchEvent(new CustomEvent("cart:count", { detail: count })); } catch {}

  if (added) {
    try { window.dispatchEvent(new CustomEvent("cart:add", { detail: added })); } catch {}
  }

  // Non-React badge
  updateDomBadge(count);
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
  return snapshot(readRaw()).count;
}

export function getCartTotal(): number {
  return snapshot(readRaw()).total;
}

/**
 * Convenience: add by id/slug.
 * If item exists, increments qty; else creates with provided patch or catalog defaults.
 *
 * Example (no price needed, taken from catalog):
 *   add("chatgpt-side-hustles", 1)
 *
 * Example (override title/image if you want, price still defaults to catalog):
 *   add("chatgpt-side-hustles", 1, { title: "My custom title" })
 */
export function add(id: string, qty = 1, patch: Partial<Omit<CartItem, "id" | "qty">> = {}) {
  if (!isClient()) return;
  const items = readRaw();
  const q = Math.max(1, Math.floor(qty));
  const idx = items.findIndex((i) => i.id === String(id));

  // Defaults from catalog; patch can override title/image and price if explicitly set
  const catalogDefaults = enrichFromCatalog(String(id), {});

  let added: CartItem;
  if (idx >= 0) {
    items[idx].qty += q;
    if (patch.title != null) items[idx].title = String(patch.title);
    if (patch.image != null) items[idx].image = patch.image || undefined;
    if (patch.price != null) {
      items[idx].price = Number(patch.price) || 0;
    } else if (!items[idx].price && typeof catalogDefaults.price === "number") {
      items[idx].price = Number(catalogDefaults.price) || 0;
    }
    // Backfill title/image from catalog if still missing
    if (!items[idx].title && catalogDefaults.title) items[idx].title = String(catalogDefaults.title);
    if (!items[idx].image && catalogDefaults.image) items[idx].image = String(catalogDefaults.image);
    added = { ...items[idx] };
  } else {
    const price =
      patch.price != null
        ? Number(patch.price) || 0
        : (typeof catalogDefaults.price === "number" ? Number(catalogDefaults.price) : 0);

    added = {
      id: String(id),
      title: String(patch.title ?? catalogDefaults.title ?? id),
      price,
      image: patch.image ?? (catalogDefaults.image ? String(catalogDefaults.image) : undefined),
      qty: q,
    };
    items.push(added);
  }
  write(items, added);
}

/** Add a fully-specified item (will still enrich from catalog if price/image are missing) */
export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  if (!isClient()) return;
  const items = readRaw();
  const q = Math.max(1, Math.floor(qty));
  const idx = items.findIndex((i) => i.id === String(item.id));

  // If price/image/title absent or zero, enrich from catalog
  const enriched = enrichFromCatalog(String(item.id), item);

  let added: CartItem | undefined;

  if (idx >= 0) {
    items[idx].qty += q;
    items[idx].title = String(enriched.title ?? items[idx].title);
    items[idx].price = Number(enriched.price ?? items[idx].price) || 0;
    items[idx].image = (enriched.image ?? items[idx].image) || undefined;
    added = { ...items[idx] };
  } else {
    added = {
      id: String(item.id),
      title: String(enriched.title ?? item.title ?? item.id),
      price: Number(enriched.price ?? item.price) || 0,
      image: enriched.image ?? item.image,
      qty: q,
    };
    items.push(added);
  }
  write(items, added);
}

/** Sugar: add by slug (alias of add) */
export const addBySlug = (slug: string, qty = 1, patch?: Partial<Omit<CartItem, "id" | "qty">>) =>
  add(slug, qty, patch);

/** Sugar: add by numeric product id (just converts to string and resolves) */
export const addById = (id: number, qty = 1, patch?: Partial<Omit<CartItem, "id" | "qty">>) =>
  add(String(id), qty, patch);

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
  try {
    // Clear modern + mirrors + legacy
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(LEGACY_MAP_KEY);
    // If "cart" was used as array, clearing to "{}" avoids consumers that expect object
    const legacy = safeParse(window.localStorage.getItem(LEGACY_ARRAY_KEY));
    if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) {
      window.localStorage.setItem(LEGACY_ARRAY_KEY, "{}");
    } else {
      window.localStorage.setItem(LEGACY_ARRAY_KEY, "[]");
    }
    window.localStorage.setItem(COUNT_KEY, "0");
  } catch {}
  write([]); // emits events + badge
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

  window.addEventListener(EVT, listener as EventListener);

  // Back-compat legacy events as well
  const legacyNames = ["cart:updated", "cart:change", "cart-update", "cart:count"];
  const legacyListener = () => {
    const snap = snapshot(readRaw());
    handler(snap.count, snap);
  };
  legacyNames.forEach((n) => window.addEventListener(n as any, legacyListener as EventListener));

  // Cross-tab updates via localStorage
  const onStorage = (e: StorageEvent) => {
    if (!e.key) return;
    if ([KEY, COUNT_KEY, LEGACY_ARRAY_KEY, LEGACY_MAP_KEY].includes(e.key)) {
      const snap = snapshot(readRaw());
      handler(snap.count, snap);
    }
  };
  window.addEventListener("storage", onStorage);

  // Initialize immediately
  const snap = snapshot(readRaw());
  handler(snap.count, snap);

  return () => {
    window.removeEventListener(EVT, listener as EventListener);
    legacyNames.forEach((n) => window.removeEventListener(n as any, legacyListener as EventListener));
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------------------- Back-compat aliases ---------------------- */
export const count = getCartCount;
export const getItems = getCart;
export function setItems(items: CartItem[]) {
  write(items ?? []);
}
