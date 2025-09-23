// data/categories.ts
export type Category = { label: string; slug: string; image: string };

const BASE: Omit<Category, "image">[] = [
  { label: "AI & ChatGPT Guides",          slug: "ai-and-chatgpt-guides" },
  { label: "Planners & Productivity",      slug: "planners-and-productivity" },
  { label: "Self-Help & How-To",           slug: "self-help-and-how-to" },
  { label: "PLR & MRR Bundles",            slug: "plr-and-mrr-bundles" },
  { label: "Video Courses & Training",     slug: "video-courses-and-training" },
  { label: "Complete Shop Packages",       slug: "complete-shop-packages" },
  { label: "Health & Fitness eBooks",      slug: "health-and-fitness-ebooks" },
  { label: "Keto & Diet Guides",           slug: "keto-and-diet-guides" },
  { label: "Passive Income & Side Hustles",slug: "passive-income-and-side-hustles" },

  // New/renamed
  { label: "Digital Essentials Hub",       slug: "digital-essentials-hub" },
  { label: "Social Media Kits",            slug: "social-media-kits" },
  { label: "Fonts & Icons",                slug: "fonts-and-icons" },
  { label: "Religious eBooks",             slug: "religious-ebooks" },

  // Keep
  { label: "Web Templates",                slug: "web-templates" },
];

export const CATEGORIES: Category[] = BASE.map(c => ({
  ...c,
  image: `/images/categories/${c.slug}/card.jpg`,
}));
