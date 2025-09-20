// data/categories.ts
export type Category = {
  label: string;
  slug: string; // kebab-case, used for routes, images, etc.
};

export const CATEGORIES: Category[] = [
  // RENAMES (old → new)
  { label: "AI & ChatGPT Guides",        slug: "ai-chatgpt-guides" },          // was "Digital Art"
  { label: "Planners & Productivity",    slug: "planners-productivity" },      // was "Printable Planners"
  { label: "Self-Help & How-To",         slug: "self-help-how-to" },           // was "Photography Prints"
  { label: "PLR & MRR Bundles",          slug: "plr-mrr-bundles" },            // was "Audio Templates"
  { label: "Video Courses & Training",   slug: "video-courses-training" },     // was "Video Resources"
  { label: "Complete Shop Packages",     slug: "complete-shop-packages" },     // was "Templates"
  { label: "Health & Fitness eBooks",    slug: "health-fitness-ebooks" },      // was "eBooks"
  { label: "Keto & Diet Guides",         slug: "keto-diet-guides" },           // was "Fonts"
  { label: "Passive Income & Side Hustles", slug: "passive-income-side-hustles" }, // was "Icons"

  // NEW categories (in addition to the renames above)
  { label: "Web Templates",              slug: "web-templates" },
  { label: "Prompt Packs & AI Tools",    slug: "prompt-packs-ai-tools" },

  // You asked to keep separate "Fonts" and "Icons" categories as well,
  // even though the originals got renamed above. These are brand-new:
  { label: "Fonts",                       slug: "fonts" },
  { label: "Icons",                       slug: "icons" },
];
