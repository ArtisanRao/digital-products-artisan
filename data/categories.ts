// data/categories.ts
export type Category = {
  label: string;
  slug: string;
  image: string; // /images/categories/<slug>/card.jpg
  description: string;

  /**
   * Optional curated products to preview under the category title
   * on the “All Categories” page. Use product slugs (preferred) or ids.
   * If omitted, the UI will auto-pick recent/first products for the category.
   */
  topProducts?: Array<{ slug?: string; id?: string | number; image?: string }>;
};

/** Legacy slug redirects (old → new) */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",
};

/** Normalize a slug (apply legacy → new mapping) */
export function resolveCategorySlug(slug: string): string {
  return CATEGORY_SLUG_ALIASES[slug] ?? slug;
}

/**
 * Base list (no image paths yet). You can add/adjust topProducts
 * at any time—only the slugs/ids matter.
 */
const BASE: Array<Omit<Category, "image">> = [
  {
    label: "AI & ChatGPT Guides",
    slug: "ai-and-chatgpt-guides",
    description: "Guides, prompts and AI learning resources.",
    topProducts: [
      { slug: "ai-mastery-video-course" }, // example — adjust to your real slugs
    ],
  },
  {
    label: "Planners & Productivity",
    slug: "planners-and-productivity",
    description: "Digital planners, journals and productivity tools.",
  },
  {
    label: "Self-Help & How-To",
    slug: "self-help-and-how-to",
    description: "Practical how-to guides and self-improvement.",
    // topProducts: [{ slug: "the-art-of-giving-no-fcks" }],
  },
  {
    label: "PLR & MRR Bundles",
    slug: "plr-and-mrr-bundles",
    description: "Done-for-you PLR/MRR products and kits.",
    topProducts: [
      { slug: "plr-and-mrr-bundles" },
      { slug: "plr-toolkit" }, // optional extra preview
    ],
  },
  {
    label: "Video Courses & Training",
    slug: "video-courses-and-training",
    description: "Structured video lessons and trainings.",
    topProducts: [{ slug: "ai-mastery-video-course" }],
  },
  {
    label: "Complete Shop Packages",
    slug: "complete-shop-packages",
    description: "Turn-key storefront bundles and assets.",
    topProducts: [{ slug: "buy-this-complete-shop" }],
  },
  {
    label: "Health & Fitness eBooks",
    slug: "health-and-fitness-ebooks",
    description: "Nutrition, fitness and wellness books.",
  },
  {
    label: "Keto & Diet Guides",
    slug: "keto-and-diet-guides",
    description: "Keto and nutrition programs and meal plans.",
  },
  {
    label: "Passive Income & Side Hustles",
    slug: "passive-income-and-side-hustles",
    description: "Monetization playbooks and templates.",
  },
  {
    label: "Digital Essentials Hub",
    slug: "digital-essentials-hub",
    description: "Prompt packs, automations, and utilities.",
  },
  {
    label: "Social Media Kits",
    slug: "social-media-kits",
    description: "Post templates and brandable assets for socials.",
  },
  {
    label: "Fonts & Icons",
    slug: "fonts-and-icons",
    description: "Font families and icon sets.",
  },
  {
    label: "Religious eBooks",
    slug: "religious-ebooks",
    description: "Faith-centered books, devotionals and study guides.",
    topProducts: [{ slug: "religious-ebooks" }],
  },
  {
    label: "Web Templates",
    slug: "web-templates",
    description: "Website templates, UI kits and themes.",
  },
];

/** Ensure every category points to its curated cover */
export const CATEGORIES: Category[] = BASE.map((c) => ({
  ...c,
  image: `/images/categories/${c.slug}/card.jpg`,
}));

/** Maps */
export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);
export const CATEGORY_LABELS: string[] = CATEGORIES.map((c) => c.label);

/* ---- NEW/Existing: label/text → slug helpers (authoritative) ---- */
function norm(txt: string) {
  return txt
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORIES.flatMap((c) => {
    const base = c.label;
    const variants = new Set<string>([
      base,
      base.replace(/&/g, "and"),
      base.replace(/\band\b/gi, "&"),
      base.replace(/\be-?books?\b/gi, "ebooks"),
      base.replace(/\bebooks\b/i, "ebook"),
    ]);
    return Array.from(variants).map((v) => [norm(v), c.slug] as const);
  })
);

/** Try to get a known slug from any free-text (label or sloppy slug). */
export function slugForText(text?: string): string | undefined {
  if (!text) return;
  // first treat it like a slug (apply legacy map)
  const asSlug = resolveCategorySlug(text);
  if (CATEGORY_BY_SLUG[asSlug]) return asSlug;
  // else map a label/phrase to a slug
  return LABEL_TO_SLUG[norm(text)];
}

/** Helper to get a category (accepts legacy slug too) */
export function getCategory(slug: string): Category | undefined {
  const normalized = resolveCategorySlug(slug);
  return CATEGORY_BY_SLUG[normalized];
}

/** Curated image path (single source of truth) */
export function categoryImage(slug: string): string {
  const normalized = resolveCategorySlug(slug);
  return `/images/categories/${normalized}/card.jpg`;
}
