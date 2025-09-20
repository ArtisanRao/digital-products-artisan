export type Category = { label: string; slug: string };

export const CATEGORIES: Category[] = [
  { label: "AI & ChatGPT Guides",        slug: "ai-chatgpt-guides" },        // replaces “Digital Art”
  { label: "Planners & Productivity",    slug: "planners-productivity" },    // replaces “Printable Planners”
  { label: "Self-Help & How-To",         slug: "self-help-how-to" },         // replaces “Photography Prints”
  { label: "PLR & MRR Bundles",          slug: "plr-mrr-bundles" },          // replaces “Audio Templates”
  { label: "Video Courses & Training",   slug: "video-courses-training" },   // replaces “Video Resources”
  { label: "Complete Shop Packages",     slug: "complete-shop-packages" },   // replaces “Templates”
  { label: "Health & Fitness eBooks",    slug: "health-fitness-ebooks" },    // replaces “eBooks”
  { label: "Keto & Diet Guides",         slug: "keto-diet-guides" },         // replaces “Fonts”
  { label: "Passive Income & Side Hustles", slug: "passive-income-side-hustles" }, // replaces “Icons”
  // New additions
  { label: "Web Templates",              slug: "web-templates" },
  { label: "Prompt Packs & AI Tools",    slug: "prompt-packs-ai-tools" },
  { label: "Fonts",                      slug: "fonts" },
  { label: "Icons",                      slug: "icons" },
];
