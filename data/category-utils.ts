// data/category-utils.ts
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // previous rename set you already had (keep if present)
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

  // NEW renames (today)
  "Prompt Packs & AI Tools": "Digital Essentials Hub",
  "Fonts": "Creative Fonts & Icons",
  "Icons": "Religious eBooks",

  // these remain as-is
  // Social Media Kits, ...
};

export type CategoryRec = { label: string; slug: string };

// single source of truth
import { CATEGORIES } from "./categories";

const byLabel = new Map(CATEGORIES.map((c) => [c.label, c]));
const bySlug  = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategoryByLabel(label: string): CategoryRec | undefined {
  return byLabel.get(label);
}

export function normalizeCategoryLabel(label: string): string {
  return LEGACY_CATEGORY_MAP[label] ?? label;
}

export function labelToSlugAny(label: string): string | undefined {
  const newLabel = normalizeCategoryLabel(label);
  return byLabel.get(newLabel)?.slug;
}
