import { imageManifest } from "./image-manifest"

export type Product = {
  id: number
  slug: string
  title: string
  description: string
  longDescription?: string
  price: number
  originalPrice: number
  category: string               // canonical Category LABEL (not slug)
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string
  images?: string[]
  /** Relative to /private (e.g., "files/passive-income-ebook.zip") */
  downloadPath?: string
}

/** Build a URL-safe product path (supports &, $, ), spaces, unicode, etc.) */
export function productPath(p: Pick<Product, "slug"> | string): string {
  const slug = typeof p === "string" ? p : p.slug
  return `/products/${encodeURIComponent(String(slug))}`
}

/** Keep "cover" first if present. */
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p)
  return covers.length ? [...covers, ...others] : list
}

/** Deterministic, stable numeric ID from slug (djb2). */
function stableId(slug: string): number {
  let h = 5381
  for (const ch of slug) h = ((h << 5) + h) ^ ch.charCodeAt(0)
  return 10000 + (Math.abs(h) % 90000) // 5-digit, stable
}

/** Title-case from slug (only used if no manual title). */
function titleize(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

/** Canonical category LABELS (match your categories.ts labels exactly). */
export const CATEGORY_LABELS = {
  AI: "AI & ChatGPT Guides",
  PLANNERS: "Planners & Productivity",
  SELF_HELP: "Self-Help & How-To",
  PLR: "PLR & MRR Bundles",
  VIDEO: "Video Courses & Training",
  SHOP: "Complete Shop Packages",
  HEALTH: "Health & Fitness eBooks",
  KETO: "Keto & Diet Guides",
  PASSIVE: "Passive Income & Side Hustles",
  WEB: "Web Templates",
  ESSENTIALS: "Digital Essentials Hub",
  SOCIAL: "Social Media Kits",
  FONTS_ICONS: "Fonts & Icons",
  RELIGIOUS: "Religious Ebooks",
} as const

/** Defaults for items without explicit pricing */
const DEFAULT_PRICE = 9.99 as number
const DEFAULT_ORIGINAL_PRICE = 0 as number

/**
 * Narrow, safe fallback from folder name.
 * Order matters: most specific first; no broad "ebook" catch-alls.
 */
function inferCategory(slug: string): string {
  const s = slug.toLowerCase()

  if (/(religious|faith|bible|devotion(al)?|sermon|qur'?an|quran|islam|church|christ)/.test(s))
    return CATEGORY_LABELS.RELIGIOUS

  if (/(keto|low[- ]?carb)/.test(s))
    return CATEGORY_LABELS.KETO

  if (/(passive|side[- ]?hustle|income|freedom|wealth|make[- ]?money|as[- ]?you[- ]?sleep)/.test(s))
    return CATEGORY_LABELS.PASSIVE

  if (/(health|fitness|wellness|diet|nutrition)/.test(s))
    return CATEGORY_LABELS.HEALTH

  if (/(ai|chatgpt|gpt|prompt)/.test(s))
    return CATEGORY_LABELS.AI

  if (/(planner|journal|productivity|organizer|notion|tracker)/.test(s))
    return CATEGORY_LABELS.PLANNERS

  if (/(self[- ]?help|how[- ]?to|mindset|habit|routine)/.test(s))
    return CATEGORY_LABELS.SELF_HELP

  if (/(plr|mrr|bundle|resell|resale)/.test(s))
    return CATEGORY_LABELS.PLR

  if (/(video|course|training|lesson)/.test(s))
    return CATEGORY_LABELS.VIDEO

  if (/(complete[- ]?shop|shop[- ]?package|storefront|store[- ]?bundle)/.test(s))
    return CATEGORY_LABELS.SHOP

  if (/(web[- ]?template|template|ui[- ]?kit|theme)/.test(s))
    return CATEGORY_LABELS.WEB

  if (/(social[- ]?media|instagram|pinterest|facebook|tiktok|brand(ing)?[- ]?kit)/.test(s))
    return CATEGORY_LABELS.SOCIAL

  if (/(font|typeface|icons?)/.test(s))
    return CATEGORY_LABELS.FONTS_ICONS

  return CATEGORY_LABELS.ESSENTIALS
}

/** Normalize a title for title-based overrides */
function normTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+ ]+/g, "").replace(/\s+/g, " ").trim()
}

/**
 * Price overrides by SLUG (highest priority).
 * These keys must match your folder names (imageManifest keys).
 * Values are NUMBERS (USD/EUR-agnostic).
 */
const PRICE_BY_SLUG: Record<string, number> = {
  // From your list (1–15, 17):
  "chatgpt-side-hustles": 2.99,           // 1
  "make-money-as-you-sleep": 2.99,        // 2
  "faceless-marketing": 2.99,             // 3
  "digital-wealth": 28.99,                // 4 (alias; see also below)
  "digital-wealth-ultimate-guide": 28.99, // 4 (common alt slug)
  "cybersecurity-trinity": 12.99,         // 5
  "85-million-plus": 2.99,                // 6
  "beginners-guide-to-boolean": 9.99,     // 7
  "the-art-of-not-giving-a-fuck": 9.99,   // 8
  "plr-mrr-digital-products": 39.99,      // 9
  "the-exorcist-tradition": 4.99,         // 10
  "cryptocurrency-secrets": 2.99,         // 11
  "plr-keto-diet-secrets": 1.99,          // 12
  "100-christmas-digital-products": 1.99, // 13
  "passive-income-ebook": 2.99,           // 14
  "eating-healthy-ebook": 6.99,           // 15
  // 16 looks like a category landing too; leaving as a product override just in case:
  "ai-and-chatgpt-guides": 1.99,          // 16
  // 17: second ChatGPT Side Hustles (ensure distinct slug in repo)
  "chatgpt-side-hustles-v2": 1.99,        // 17 (use this slug for the $1.99 variant)

  // Extra aliases that have appeared in your code in the past:
  "the-art-of-giving-no-fucks": 9.99,     // featured variant seen earlier
}

/**
 * Price overrides by TITLE (fallback if slug doesn’t match exactly).
 * Keys are normalized titles (lowercase, punctuation-stripped).
 */
const PRICE_BY_TITLE: Record<string, number> = {
  [normTitle("ChatGPT Side hustles")]: 2.99,
  [normTitle("Make Money As You Sleep")]: 2.99,
  [normTitle("Faceless Marketing")]: 2.99,
  [normTitle("Digital Wealth")]: 28.99,
  [normTitle("Cybersecurity Trinity")]: 12.99,
  [normTitle("85 Million+")]: 2.99,
  [normTitle("Beginner's Guide to Boolean")]: 9.99,
  [normTitle("The Art of not Giving A Fuck")]: 9.99,
  [normTitle("PLR MRR Digital Products")]: 39.99,
  [normTitle("The Exorcist Tradition")]: 4.99,
  [normTitle("Cryptocurrency Secrets")]: 2.99,
  [normTitle("PLR Keto Diet Secrets")]: 1.99,
  [normTitle("100 Christmas Digital Products")]: 1.99,
  [normTitle("Passive Income Ebook")]: 2.99,
  [normTitle("Eating Healthy Ebook")]: 6.99,
  [normTitle("AI & ChatGPT Guides")]: 1.99,
  // Optional: if you want a title signal for the $1.99 variant:
  [normTitle("Chatgpt Side Hustles")]: 1.99, // maps to 1.99 if slug didn’t match
}

/**
 * Deterministic overrides for titles/categories and per-product content.
 * (Non-price fields live here; price is applied below to keep logic centralized.)
 */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  // Category landing niceties (if you have folders named like these)
  "ai-and-chatgpt-guides": { title: "AI & ChatGPT Guides", category: CATEGORY_LABELS.AI },
  "plr-and-mrr-bundles":  { title: "PLR & MRR Bundles",   category: CATEGORY_LABELS.PLR },
  "keto-and-diet-guides": { title: "Keto & Diet Guides",  category: CATEGORY_LABELS.KETO },

  // Put “wealth” / “as-you-sleep” in Passive Income (not Essentials)
  "digital-wealth":               { category: CATEGORY_LABELS.PASSIVE },
  "digital-wealth-ultimate-guide":{ category: CATEGORY_LABELS.PASSIVE },
  "make-money-as-you-sleep":      { category: CATEGORY_LABELS.PASSIVE },

  // ✸ COMPLETE SHOP WITH PLR / MRR RIGHTS — edit slug/path to your actual file
  "complete-shop-with-plr-mrr-rights": {
    title: "✸ Buy my complete Shop with PLR / MRR Rights ✸",
    category: CATEGORY_LABELS.SHOP,
    bestseller: true,
    description:
      "Own my complete digital shop with PLR + MRR rights. Edit, rebrand, and resell 30+ products. Instant download via Google Drive links.",
    longDescription: `You have here the opportunity to buy my complete shop with a big discount!! This Bundle is way more worth than 100 USD!

Profit of my PLR+MRR Bundle for your business and clients.

The PLR license allows you to edit, rebrand and sell the products as your own product, making it an excellent addition to your product line or as a lead magnet to attract potential customers. With the MRR License you can resell the product as your own. The options are endless!!

In this bundle you will receive all products of my shop:

🚀 ChatGPT Expertise BASIC PACK Video Course
🚀 ChatGPT Expertise UPGRADE PACK Video Course
🚀 Make Money with AI Art Ebook
🚀 Make Money with AI Art Video
🚀 Create AI Human Reel Videos Video Course
🚀 PLR Chat GPT Video Coures
🚀 10 Business & Marketing Video Courses PLR
🚀 100 Midjourney Prompts Abstract Art
🚀 Cryprocurrency secrets Video Course and Ebook
🚀 700 Product Ideas to sell on Etsy
🚀 Keto Diet Secrets Ebook
🚀 Eating Healthy Premium PLR EBook Complete Video Course
🚀 Carb Cycling For Weight Loss Premium PLR EBook Complete Video Course
🚀 Healthy Primal Living PLR EBook Video Course
🚀 Lose Your Belly Diet PLR EBook Video Course
🚀 Boost Your Immune System PLR EBook Video Course
🚀 Coloring Book 911
🚀 450 Coloring Book Pages
🚀 Intermittent Fasting Quick Start
🚀 ChatGPT for Internet Marketers
🚀 Juicing Recipes
🚀 Make Money with PLR Ebook
🚀 Make Money with PLR Video Course
🚀 Google Gemini 7K Prompts
🚀 Side Hustle Secrets Ebook
🚀 Side Hustle Secrets Video Upgrade
🚀 Easy Keto
🚀 1940 Graphic Recipes
🚀 Effective Instagram Marketing
🚀 Blockchain Explained Ebook

After your order is processed, you will receive a PDF document with the links to download the files from Google Drive. This item is provided electronically.

This listing is for a digital download. No physical product will be shipped.

If you have any questions, please contact me and I will be more than happy to help!`,
    // downloadPath: "files/complete-shop-with-plr-mrr-rights.zip",
  },
}

/** Build products from the image manifest (one per folder). */
const baseProducts: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = (MANUAL_OVERRIDES[slug]?.category as string) ?? inferCategory(slug)

  // Start with defaults + manual non-price overrides
  const p: Omit<Product, "images"> = {
    id: stableId(slug),
    slug,
    title: (MANUAL_OVERRIDES[slug]?.title as string) ?? titleize(slug),
    description: `A curated digital product in ${category}.`,
    longDescription: undefined,
    price: DEFAULT_PRICE,                 // default for items not in your list
    originalPrice: DEFAULT_ORIGINAL_PRICE,
    category,
    tags: [],
    rating: 0,
    reviews: 0,
    downloads: 0,
    bestseller: false,
    image: gallery?.[0] ?? `/images/products/${slug}/cover.jpg`,
    ...(MANUAL_OVERRIDES[slug] ?? {}),
  }

  // Apply price overrides with strong priority:
  // 1) Exact slug match
  if (Object.prototype.hasOwnProperty.call(PRICE_BY_SLUG, slug)) {
    p.price = PRICE_BY_SLUG[slug]
  } else {
    // 2) Title fallback (normalized)
    const key = normTitle(p.title)
    if (Object.prototype.hasOwnProperty.call(PRICE_BY_TITLE, key)) {
      p.price = PRICE_BY_TITLE[key]
    }
  }

  return p
})

export const products: Product[] = baseProducts.map((p) => {
  const gallery = coverFirst(imageManifest[p.slug])
  const images = gallery?.length ? gallery : [p.image]
  return { ...p, image: images[0], images }
})

/** Helper: select by category label (keeps Categories in sync with All Products). */
export function productsInCategory(categoryLabel: string): Product[] {
  return products.filter((p) => p.category === categoryLabel)
}

export const productsById   = Object.fromEntries(products.map((p) => [p.id,   p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
