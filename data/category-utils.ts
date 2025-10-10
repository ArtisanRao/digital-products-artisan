// data/category-utils.ts
export type CategoryRec = { label: string; slug: string };

// Single source of truth
import { CATEGORIES, resolveCategorySlug, encodeSeg } from "./categories";

/**
 * Legacy → Canonical label remaps.
 * NOTE: All targets MUST match an existing Category.label from ./categories.
 */
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // previous rename set you already had (kept, corrected where needed)
  "Digital Art": "AI & ChatGPT Guides",
  "Printable Planners": "Planners & Productivity",
  "Photography Prints": "Self-Help & How-To",
  "Audio Samples": "PLR & MRR Bundles",
  "Video Resources": "Video Courses & Training",
  "eBooks": "Health & Fitness eBooks",
  "Templates": "Web Templates",
  "Marketing tools": "Passive Income & Side Hustles",
  "Marketing Tools": "Passive Income & Side Hustles",
  "Web Templates": "Complete Shop Packages",

  // NEW renames (corrected to match existing labels)
  "Prompt Packs & AI Tools": "Digital Essentials Hub",
  "Fonts": "Fonts & Icons",
  "Icons": "Fonts & Icons",

  // these remain as-is
  // Social Media Kits, ...
};

/* ------------------------------------------------------------------ */
/* Indexes & Normalizers                                              */
/* ------------------------------------------------------------------ */

// Normalization for tolerant label matching
const norm = (txt: string) =>
  String(txt)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Build fast lookup maps
const byLabel = new Map(CATEGORIES.map((c) => [c.label, c]));
const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

// Normalized label → canonical category
const normLabelToCat = new Map<string, CategoryRec>();
for (const c of CATEGORIES) {
  const variants = new Set<string>([
    c.label,
    c.label.replace(/&/g, "and"),
    c.label.replace(/\band\b/gi, "&"),
    c.label.replace(/\be-?books?\b/gi, "ebooks"),
    c.label.replace(/\bebooks\b/i, "ebook"),
  ]);
  for (const v of variants) normLabelToCat.set(norm(v), c);
}

// Normalized legacy label → canonical category
for (const [legacy, canonical] of Object.entries(LEGACY_CATEGORY_MAP)) {
  const cat = byLabel.get(canonical);
  if (cat) normLabelToCat.set(norm(legacy), cat);
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/** Returns the canonical category by exact label (no normalization). */
export function getCategoryByLabel(label: string): CategoryRec | undefined {
  return byLabel.get(label);
}

/** Normalize a label through the legacy map; returns a canonical label if possible, otherwise the original. */
export function normalizeCategoryLabel(label: string): string {
  return LEGACY_CATEGORY_MAP[label] ?? label;
}

/** Looser: label can be sloppy (case, &/and, ebooks), legacy, etc. Returns canonical slug if found. */
export function labelToSlugAny(label: string): string | undefined {
  const hit = normLabelToCat.get(norm(label));
  return hit?.slug;
}

/** Resolve either a label or a slug to the canonical Category (accepts legacy slugs). */
export function resolveCategory(input: string): CategoryRec | undefined {
  if (!input) return undefined;

  // 1) Try as label (tolerant)
  const labelHit = normLabelToCat.get(norm(input));
  if (labelHit) return labelHit;

  // 2) Try as slug (apply legacy mapping from ./categories)
  const normalizedSlug = resolveCategorySlug(input);
  const slugHit = bySlug.get(normalizedSlug);
  if (slugHit) return slugHit;

  return undefined;
}

/** Ensure we return a canonical slug for a given label or slug; undefined if unknown. */
export function ensureCategorySlug(input: string): string | undefined {
  return resolveCategory(input)?.slug;
}

/** Ensure we return a canonical label for a given label or slug; undefined if unknown. */
export function ensureCategoryLabel(input: string): string | undefined {
  return resolveCategory(input)?.label;
}

/** Build a safe category path (segment encoded), optionally with a subcategory query param. */
export function categoryPathSafe(input: string, opts?: { sub?: string }): string | undefined {
  const cat = resolveCategory(input);
  if (!cat) return undefined;
  const base = `/categories/${encodeSeg(cat.slug)}`;
  if (opts?.sub) return `${base}?sub=${encodeURIComponent(String(opts.sub))}`;
  return base;
}
