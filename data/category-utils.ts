// data/category-utils.ts
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  "Digital Art": "AI & ChatGPT Guides",
  "Printable Planners": "Planners & Productivity",
  "Photography Prints": "Self-Help & How-To",
  "Audio Templates": "PLR & MRR Bundles",
  "Video Resources": "Video Courses & Training",
  "Templates": "Complete Shop Packages",
  "eBooks": "Health & Fitness eBooks",
  "Fonts": "Keto & Diet Guides",
  "Icons": "Passive Income & Side Hustles",
};

export type CategoryRec = { label: string; slug: string };

// import from your single source of truth:
import { CATEGORIES } from "./categories";

const byLabel = new Map(CATEGORIES.map(c => [c.label, c]));
const bySlug  = new Map(CATEGORIES.map(c => [c.slug, c]));

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
