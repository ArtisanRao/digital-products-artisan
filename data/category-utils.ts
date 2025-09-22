// data/category-utils.ts
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // direct renames
  "Digital Art": "AI & ChatGPT Guides",
  "Printable Planners": "Planners & Productivity",
  "Photography Prints": "Self-Help & How-To",
  "Audio Samples": "PLR & MRR Bundles",
  "Video Resources": "Video Courses & Training",
  "eBooks": "Health & Fitness eBooks",
  "Templates": "Web Templates",
  "Marketing tools": "Passive Income & Side Hustles",
  "Marketing Tools": "Passive Income & Side Hustles",

  // second-stage consolidation
  "Web Templates": "Complete Shop Packages",

  // Social Media Kits, Fonts, Icons stay as-is
};

export type CategoryRec = { label: string; slug: string };

// single source of truth
import { CATEGORIES } from "./categories";

const byLabel = new Map(CATEGORIES.map((c) => [c.label, c]));
const bySlug  = new Map(CATEGORIES.map((c) => [c.slug, c]));

/** Returns the canonical CategoryRec by NEW label; undefined if not found. */
export function getCategoryByLabel(label: string): CategoryRec | undefined {
  return byLabel.get(label);
}

/** Returns the canonical NEW label given any (old or new) label. */
export function normalizeCategoryLabel(label: string): string {
  return LEGACY_CATEGORY_MAP[label] ?? label;
}

/** Returns the canonical slug for any (old or new) label. */
export function labelToSlugAny(label: string): string | undefined {
  const newLabel = normalizeCategoryLabel(label);
  return byLabel.get(newLabel)?.slug;
}

/** Convenience: lookup by slug. */
export function getCategoryBySlug(slug: string): CategoryRec | undefined {
  return bySlug.get(slug);
}
