# from repo root
$path = "data\categories.ts"
$content = @"
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

  // Existing/extra categories
  { label: "Web Templates",              slug: "web-templates" },
  { label: "Prompt Packs & AI Tools",    slug: "prompt-packs-and-ai-tools" },
  { label: "Social Media Kits",          slug: "social-media-kits" },
  { label: "Fonts",                      slug: "fonts" },
  { label: "Icons",                      slug: "icons" },
];
"@
Set-Content -Path $path -Value $content

