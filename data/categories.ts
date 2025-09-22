export type Category = { label: string; slug: string };

export const CATEGORIES: Category[] = [
  { label: "AI & ChatGPT Guides",        slug: "ai-and-chatgpt-guides" },
  { label: "Planners & Productivity",    slug: "planners-productivity" },
  { label: "Self-Help & How-To",         slug: "self-help-and-how-to" },
  { label: "PLR & MRR Bundles",          slug: "plr-mrr-bundles" },
  { label: "Video Courses & Training",   slug: "video-courses-and-training" },
  { label: "Complete Shop Packages",     slug: "complete-shop-packages" },
  { label: "Health & Fitness eBooks",    slug: "health-fitness-ebooks" },
  { label: "Keto & Diet Guides",         slug: "keto-diet-guides" },
  { label: "Passive Income & Side Hustles", slug: "passive-income-side-hustles" },

  // Renamed/extra categories
  { label: "Digital Essentials Hub",     slug: "digital-essentials-hub" }, // (was: Prompt Packs & AI Tools)
  { label: "Fonts & Icons",              slug: "fonts-and-icons" },                  // label changed only
  { label: "Religious eBooks",           slug: "religious-ebooks" },       // (was: Icons)

  // Keep
  { label: "Web Templates",              slug: "web-templates" },
  { label: "Social Media Kits",          slug: "social-media-kits" },
];
