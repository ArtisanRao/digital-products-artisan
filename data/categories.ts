// data/categories.ts
export type Category = {
  label: string;
  slug: string;
  image: string;        // /images/categories/<slug>/card.jpg
  description: string;
};

const BASE: Omit<Category, "image">[] = [
  { label: "AI & ChatGPT Guides",           slug: "ai-and-chatgpt-guides",        description: "Guides, prompts and AI learning resources." },
  { label: "Planners & Productivity",       slug: "planners-and-productivity",    description: "Digital planners, journals and productivity tools." },
  { label: "Self-Help & How-To",            slug: "self-help-and-how-to",         description: "Practical how-to guides and self-improvement." },
  { label: "PLR & MRR Bundles",             slug: "plr-and-mrr-bundles",          description: "Done-for-you PLR/MRR products and kits." },
  { label: "Video Courses & Training",      slug: "video-courses-and-training",   description: "Structured video lessons and trainings." },
  { label: "Complete Shop Packages",        slug: "complete-shop-packages",       description: "Turn-key storefront bundles and assets." },
  { label: "Health & Fitness eBooks",       slug: "health-and-fitness-ebooks",    description: "Nutrition, fitness and wellness books." },
  { label: "Keto & Diet Guides",            slug: "keto-and-diet-guides",         description: "Keto and nutrition programs and meal plans." },
  { label: "Passive Income & Side Hustles", slug: "passive-income-and-side-hustles", description: "Monetization playbooks and templates." },

  // New/renamed
  { label: "Digital Essentials Hub",        slug: "digital-essentials-hub",       description: "Prompt packs, automations, and utilities." },
  { label: "Social Media Kits",             slug: "social-media-kits",            description: "Post templates and brandable assets for socials." },
  { label: "Fonts & Icons",                 slug: "fonts-and-icons",              description: "Font families and icon sets." },
  { label: "Religious eBooks",              slug: "religious-ebooks",             description: "Faith-centered books, devotionals and study guides." },

  // Keep
  { label: "Web Templates",                 slug: "web-templates",                description: "Website templates, UI kits and themes." },
];

export const CATEGORIES: Category[] = BASE.map((c) => ({
  ...c,
  image: `/images/categories/${c.slug}/card.jpg`,
}));

/** Handy lookup map by slug */
export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

/** Legacy slug redirects (old → new) if you need them elsewhere */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",
};
