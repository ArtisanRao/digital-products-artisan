// Centralized slugs/titles and lightweight data helpers

export const CATEGORY_MAP = {
  "ebooks": "eBooks",
  "digital-art": "Digital Art",
  "templates": "Templates",
  "marketing-tools": "Marketing Tools",
  "printable-planners": "Printable Planners",
  "photography-prints": "Photography Prints",
  "fonts": "Fonts",
  "icons": "Icons",
  "web-templates": "Web Templates",
  "video-resources": "Video Resources",
  "audio-samples": "Audio Samples",
  "social-media-kits": "Social Media Kits",

  // present in your folders; keep if you use it
  "software-plugins": "Software Plugins",
} as const;

export type CategorySlug = keyof typeof CATEGORY_MAP;

export function getAllCategorySlugs(): CategorySlug[] {
  return Object.keys(CATEGORY_MAP) as CategorySlug[];
}

/** Minimal product shape for filtering */
export type ProductLike = {
  id?: string | number;
  title?: string;
  categorySlug?: string;
  category?: string;
};

/**
 * Pluggable product source:
 * - You can set this once from wherever you load products:
 *     import { setProductsSource } from "@/lib/categories";
 *     import { allProducts } from "@/data/products";
 *     setProductsSource(allProducts);
 */
let _productsSource: ProductLike[] | (() => ProductLike[]) = [];

/** Set the array *or* a getter function that returns your products */
export function setProductsSource(src: ProductLike[] | (() => ProductLike[])) {
  _productsSource = src;
}

/** Internal: obtain products safely */
function getAllProducts(): ProductLike[] {
  return typeof _productsSource === "function" ? _productsSource() : _productsSource;
}

/** Fallback slugifier if your products only have `category` (human title) */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Main helper used by pages/components */
export function getProductsByCategory(slug: CategorySlug): ProductLike[] {
  const all = getAllProducts();
  if (!all || all.length === 0) return []; // safe default
  return all.filter((p) => {
    const c = (p as any).categorySlug ?? (p as any).category;
    if (!c) return false;
    const normalized = (Object.keys(CATEGORY_MAP) as string[]).includes(String(c))
      ? String(c)
      : slugify(String(c));
    return normalized === slug;
  });
}
