// lib/category-infer.ts
import { CATEGORY_BY_SLUG, CATEGORY_SLUG_ALIASES } from "@/data/categories";

export type AnyProduct = {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;
  label?: string;
  description?: string;
  category?: string;
  categorySlug?: string;
  slugCategory?: string;
  primaryCategorySlug?: string;
  categories?: string[];
  tags?: string[];
  collection?: string;
  [k: string]: any;
};

export const KNOWN_SLUGS = Object.keys(CATEGORY_BY_SLUG);

export const norm = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\breligous\b/g, "religious") // common typo
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const LABEL_TO_SLUG = new Map<string, string>(
  KNOWN_SLUGS.map((slug) => [norm(CATEGORY_BY_SLUG[slug].label), slug]),
);

const normalizeSlug = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

// ————— Keyword rules only used as LAST resort (when product has no clear category fields)
const KEYWORD_RULES: Array<{ re: RegExp; slug: string }> = [
  { re: /\b(religious|religion|bible|qur'?an|islam|christ|devotional|prayer|faith|hindu|exorcist)\b/i, slug: "religious-ebooks" },
  { re: /\b(chatgpt|gpt|prompt|ai)\b/i, slug: "ai-and-chatgpt-guides" },
  { re: /\b(font|typeface|icon set|icons?)\b/i, slug: "fonts-and-icons" },
  { re: /\b(plr|mrr|resell rights|private label rights|master resell)\b/i, slug: "plr-and-mrr-bundles" },
  { re: /\b(template|theme|website|landing page|ui kit)\b/i, slug: "web-templates" },
  { re: /\b(course|training|masterclass|bootcamp|video lessons?)\b/i, slug: "video-courses-and-training" },
  { re: /\b(keto|diet|meal plan|weight loss|nutrition|fitness|workout)\b/i, slug: "health-and-fitness-ebooks" },
  { re: /\b(planner|journal|habit tracker|productivity)\b/i, slug: "planners-and-productivity" },
  { re: /\b(social media|instagram|facebook|tiktok|pinterest|canva)\b/i, slug: "social-media-kits" },
  { re: /\b(complete shop|store package|storefront)\b/i, slug: "complete-shop-packages" },
];

function existingSlugFromFields(p: AnyProduct): string | null {
  // 1) explicit slug fields win
  const explicit = p.categorySlug || p.slugCategory || p.primaryCategorySlug;
  if (explicit) {
    const s = normalizeSlug(String(explicit));
    return KNOWN_SLUGS.includes(s) ? s : null;
  }

  // 2) look through category-like fields
  const cands: string[] = [];
  if (typeof p.category === "string") cands.push(p.category);
  if (Array.isArray(p.categories)) cands.push(...p.categories);
  if (Array.isArray(p.tags)) cands.push(...p.tags);
  if (typeof p.collection === "string") cands.push(p.collection);

  // a) exact slug match
  for (const raw of cands) {
    const s = normalizeSlug(String(raw));
    if (KNOWN_SLUGS.includes(s)) return s;
  }
  // b) label→slug match
  for (const raw of cands) {
    const n = norm(String(raw));
    const found = LABEL_TO_SLUG.get(n);
    if (found) return found;
  }

  return null;
}

export function inferCategorySlug(p: AnyProduct): string | null {
  // If fields already imply a slug, use that.
  const fromFields = existingSlugFromFields(p);
  if (fromFields) return fromFields;

  // Otherwise try keywords from title/description (very conservative).
  const hay = `${p.title ?? ""} ${p.name ?? ""} ${p.label ?? ""} ${p.description ?? ""}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(hay)) return rule.slug;
  }
  return null;
}

/** True if this product belongs to the given category slug. */
export function productMatchesCategory(p: AnyProduct, catSlug: string): boolean {
  const normalized = normalizeSlug(catSlug);

  // explicit slug wins
  const explicit = existingSlugFromFields(p);
  if (explicit) return explicit === normalized;

  // last resort: inferred
  const inferred = inferCategorySlug(p);
  return inferred === normalized;
}

/** Helper for Array.filter */
export const makeCategoryFilter =
  (catSlug: string) =>
  (p: AnyProduct) =>
    productMatchesCategory(p, catSlug);

/** Audit helpers used by the API */
export function auditProduct(p: AnyProduct) {
  const id = p.id ?? p.slug ?? p.title ?? "(no id)";
  const title = p.title ?? p.name ?? p.label ?? "(untitled)";
  const fieldSlug = existingSlugFromFields(p);
  const inferred = inferCategorySlug(p);

  return {
    id,
    slug: p.slug ?? null,
    title,
    fieldSlug,
    fieldLabel: fieldSlug ? CATEGORY_BY_SLUG[fieldSlug]?.label : null,
    inferredSlug: inferred,
    inferredLabel: inferred ? CATEGORY_BY_SLUG[inferred]?.label : null,
    sources: {
      category: p.category ?? null,
      categories: Array.isArray(p.categories) ? p.categories : [],
      tags: Array.isArray(p.tags) ? p.tags : [],
      collection: p.collection ?? null,
    },
    mismatch: Boolean(fieldSlug && inferred && fieldSlug !== inferred),
    unknown: inferred === null && !fieldSlug,
  };
}

export function auditAll(list: AnyProduct[]) {
  const rows = list.map(auditProduct);
  const matched = rows.filter((r) => !r.mismatch && !r.unknown).length;
  const mismatched = rows.filter((r) => r.mismatch).length;
  const unknown = rows.filter((r) => r.unknown).length;

  return {
    total: rows.length,
    matched,
    mismatched,
    unknown,
    rows,
  };
}
