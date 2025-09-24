// data/categories.ts
export type Category = {
  label: string;
  slug: string;
  image: string;        // /images/categories/<slug>/card.jpg
  description: string;
};

/** Legacy + common-misspelling slug redirects (old → new) */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  // Legacy
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",

  // Common typos / near-misses
  "religous-ebooks": "religious-ebooks",   // typo
  "religion-ebooks": "religious-ebooks",   // near-match
};

/** Normalize a slug (apply legacy → new mapping) */
export function resolveCategorySlug(slug: string): string {
  return CATEGORY_SLUG_ALIASES[slug] ?? slug;
}

const BASE: Array<Omit<Category, "image">> = [
  { label: "AI & ChatGPT Guides",           slug: "ai-and-chatgpt-guides",           description: "Guides, prompts and AI learning resources." },
  { label: "Planners & Productivity",       slug: "planners-and-productivity",       description: "Digital planners, journals and productivity tools." },
  { label: "Self-Help & How-To",            slug: "self-help-and-how-to",            description: "Practical how-to guides and self-improvement." },
  { label: "PLR & MRR Bundles",             slug: "plr-and-mrr-bundles",             description: "Done-for-you PLR/MRR products and kits." },
  { label: "Video Courses & Training",      slug: "video-courses-and-training",      description: "Structured video lessons and trainings." },
  { label: "Complete Shop Packages",        slug: "complete-shop-packages",          description: "Turn-key storefront bundles and assets." },
  { label: "Health & Fitness eBooks",       slug: "health-and-fitness-ebooks",       description: "Nutrition, fitness and wellness books." },
  { label: "Keto & Diet Guides",            slug: "keto-and-diet-guides",            description: "Keto and nutrition programs and meal plans." },
  { label: "Passive Income & Side Hustles", slug: "passive-income-and-side-hustles", description: "Monetization playbooks and templates." },

  // New/renamed
  { label: "Digital Essentials Hub",        slug: "digital-essentials-hub",          description: "Prompt packs, automations, and utilities." },
  { label: "Social Media Kits",             slug: "social-media-kits",               description: "Post templates and brandable assets for socials." },
  { label: "Fonts & Icons",                 slug: "fonts-and-icons",                 description: "Font families and icon sets." },
  { label: "Religious eBooks",              slug: "religious-ebooks",                description: "Faith-centered books, devotionals and study guides." },

  // Keep
  { label: "Web Templates",                 slug: "web-templates",                   description: "Website templates, UI kits and themes." },
];

/** Ensure every category points to its curated cover */
export const CATEGORIES: Category[] = BASE.map((c) => ({
  ...c,
  image: `/images/categories/${c.slug}/card.jpg`,
}));

/** Quick lookup maps & helpers */
export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

export const CATEGORY_LABELS: string[] = CATEGORIES.map((c) => c.label);

/** Helper to get a category (accepts legacy/alias slug too) */
export function getCategory(slug: string): Category | undefined {
  const normalized = resolveCategorySlug(slug);
  return CATEGORY_BY_SLUG[normalized];
}

/** Helper to compute the curated image path (kept here for single source of truth) */
export function categoryImage(slug: string): string {
  const normalized = resolveCategorySlug(slug);
  return `/images/categories/${normalized}/card.jpg`;
}
