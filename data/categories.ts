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

  // Renamed categories
  { label: "Digital Essentials Hub",     slug: "digital-essentials-hub" }, // was: prompt-packs-and-ai-tools
  { label: "Creative Fonts & Icons",     slug: "fonts" },                  // label only (keep slug for stability)
  { label: "Religious eBooks",           slug: "religious-ebooks" },       // was: icons

  // Keep as-is
  { label: "Web Templates",              slug: "web-templates" },
  { label: "Social Media Kits",          slug: "social-media-kits" },
];
