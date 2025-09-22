# from repo root
$path = "data\category-utils.ts"
$content = @"
// data/category-utils.ts

export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // direct renames
  "Digital Art": "AI & ChatGPT Guides",
  "Printable Planners": "Planners & Productivity",
  "Photography Prints": "Self-Help & How-To",
  "Audio Samples": "PLR & MRR Bundles",
  "Audio Templates": "PLR & MRR Bundles",    // alt variant
  "Video Resources": "Video Courses & Training",
  "eBooks": "Health & Fitness eBooks",
  "Templates": "Web Templates",
  "Marketing tools": "Passive Income & Side Hustles", // lowercase t
  "Marketing Tools": "Passive Income & Side Hustles",

  // second-stage consolidation you requested
  "Web Templates": "Complete Shop Packages",

  // keep as-is: Social Media Kits, Fonts, Icons
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

/**
 * Returns the canonical NEW label given any (old or new) label.
 * Follows multi-step mappings (e.g., Templates -> Web Templates -> Complete Shop Packages)
 * and guards against cycles.
 */
export function normalizeCategoryLabel(label: string): string {
  let current = label;
  const seen = new Set<string>();
  while (LEGACY_CATEGORY_MAP[current] && !seen.has(current)) {
    seen.add(current);
    current = LEGACY_CATEGORY_MAP[current];
  }
  return current;
}

/** Returns the canonical slug for any (old or new) label. */
export function labelToSlugAny(label: string): string | undefined {
  const newLabel = normalizeCategoryLabel(label);
  return byLabel.get(newLabel)?.slug;
}

/** Convenience: get CategoryRec from any (old/new) label directly. */
export function getCategoryByAnyLabel(label: string): CategoryRec | undefined {
  const newLabel = normalizeCategoryLabel(label);
  return byLabel.get(newLabel);
}
"
Set-Content -LiteralPath $path -Value $content
