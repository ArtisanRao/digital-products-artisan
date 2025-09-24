// data/products.ts
import { imageManifest } from "./image-manifest"
import { CATEGORIES } from "./categories"

export type Product = {
  id: number
  slug: string
  title: string
  description: string
  longDescription?: string
  price: number
  originalPrice: number
  category: string              // must match category LABEL (not slug)
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string
  images?: string[]
  downloadPath?: string
}

/** Put any filename containing "cover" first. */
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p)
  return covers.length ? [...covers, ...others] : list
}

/** Titleize with a few acronym/brand fixes. */
function titleize(slug: string): string {
  let t = slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
  // Acronyms/brands
  t = t
    .replace(/\bAi\b/g, "AI")
    .replace(/\bChatgpt\b/g, "ChatGPT")
    .replace(/\bPlr\b/g, "PLR")
    .replace(/\bMrr\b/g, "MRR")
    .replace(/\bEbooks\b/g, "eBooks")
  // Pretty forms for a couple of known slugs
  if (slug === "keto-and-diet-guides") t = "Keto & Diet Guides"
  if (slug === "ai-and-chatgpt-guides") t = "AI & Chatgpt Guides"
  if (slug === "plr-and-mrr-bundles") t = "PLR & MRR Bundles"
  return t
}

/** Canonical category LABELS (exact strings used on pages) */
const CATEGORY_LABELS = {
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
  RELIGIOUS: "Religious eBooks",
} as const

/** Inference from folder slug. Order matters (more specific first). */
function inferCategory(slug: string): string {
  const s = slug.toLowerCase()

  if (/(keto|low[- ]?carb)/.test(s)) return CATEGORY_LABELS.KETO
  if (/(ai|chatgpt|gpt|prompt)/.test(s)) return CATEGORY_LABELS.AI
  if (/(planner|journal|productivity|organizer|notion|tracker)/.test(s)) return CATEGORY_LABELS.PLANNERS
  if (/(self[- ]?help|how[- ]?to|mindset|habit|routine)/.test(s)) return CATEGORY_LABELS.SELF_HELP
  if (/(plr|mrr|bundle|resell|resale)/.test(s)) return CATEGORY_LABELS.PLR
  if (/(video|course|training|lesson)/.test(s)) return CATEGORY_LABELS.VIDEO
  if (/(complete[- ]?shop|shop[- ]?package|storefront|store[- ]?bundle)/.test(s)) return CATEGORY_LABELS.SHOP
  if (/(religious|faith|bible|devotional|devotion(al)?|sermon)/.test(s)) return CATEGORY_LABELS.RELIGIOUS
  if (/(font|typeface|icons?)/.test(s)) return CATEGORY_LABELS.FONTS_ICONS
  if (/(social[- ]?media|instagram|pinterest|facebook|tiktok|brand(ing)?[- ]?kit)/.test(s)) return CATEGORY_LABELS.SOCIAL
  if (/(web[- ]?template|template|ui[- ]?kit|theme)/.test(s)) return CATEGORY_LABELS.WEB
  // Wealth / money / biz style → Passive Income by default
  if (/(wealth|money|business|entrepreneur|online[- ]?business)/.test(s)) return CATEGORY_LABELS.PASSIVE
  // Broad health last (so Keto can win above)
  if (/(health|fitness|wellness|diet|nutrition|ebook)/.test(s)) return CATEGORY_LABELS.HEALTH

  return CATEGORY_LABELS.ESSENTIALS
}

/** Manual per-product overrides (by slug). */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  "ai-and-chatgpt-guides": {
    title: "AI & Chatgpt Guides",
  },
  "plr-and-mrr-bundles": {
    title: "PLR & MRR Bundles",
  },
  "keto-and-diet-guides": {
    title: "Keto & Diet Guides",
    category: CATEGORY_LABELS.KETO,
  },
  // Move this out of Digital Essentials Hub
  "digital-wealth-ultimate-guide": {
    category: CATEGORY_LABELS.PASSIVE,
  },
}

/** Exclude any folder that is actually a category slug (not a real product). */
const CATEGORY_SLUG_SET = new Set(CATEGORIES.map((c) => c.slug))
const PRODUCT_SLUGS = Object.keys(imageManifest).filter((slug) => !CATEGORY_SLUG_SET.has(slug))

/** Build core product objects from manifest. */
const baseProducts: Omit<Product, "images">[] = PRODUCT_SLUGS.map((slug, i) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = (MANUAL_OVERRIDES[slug]?.category as string) ?? inferCategory(slug)

  const defaults: Omit<Product, "images"> = {
    id: 1000 + i,
    slug,
    title: titleize(slug),
    description: `A curated digital product in ${category}.`,
    longDescription: undefined,
    price: 9.99,
    originalPrice: 0,
    category,
    tags: [],
    rating: 0,
    reviews: 0,
    downloads: 0,
    bestseller: false,
    image: gallery?.[0] ?? `/images/products/${slug}/cover.jpg`,
  }

  return { ...defaults, ...(MANUAL_OVERRIDES[slug] ?? {}) }
})

/** Final products with gallery attached. */
export const products: Product[] = baseProducts.map((p) => {
  const fromManifest = coverFirst(imageManifest[p.slug])
  const images = fromManifest?.length ? fromManifest : [p.image]
  return { ...p, image: images[0], images }
})

export const productsById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
