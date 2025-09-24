// data/products.ts
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
  downloadPath?: string
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

/**
 * Deterministic overrides for titles/categories where needed.
 * Add more entries here anytime you want exact control.
 */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  // Nice casing/ampersands
  "ai-and-chatgpt-guides": { title: "AI & ChatGPT Guides", category: CATEGORY_LABELS.AI },
  "plr-and-mrr-bundles":  { title: "PLR & MRR Bundles",   category: CATEGORY_LABELS.PLR },
  "keto-and-diet-guides": { title: "Keto & Diet Guides",  category: CATEGORY_LABELS.KETO },

  // Put “wealth” / “as-you-sleep” in Passive Income (not Essentials)
  "digital-wealth-ultimate-guide": { category: CATEGORY_LABELS.PASSIVE },
  "make-money-as-you-sleep":      { category: CATEGORY_LABELS.PASSIVE },
}

/** Build products from the image manifest (one per folder). */
const baseProducts: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = (MANUAL_OVERRIDES[slug]?.category as string) ?? inferCategory(slug)

  const p: Omit<Product, "images"> = {
    id: stableId(slug),
    slug,
    title: (MANUAL_OVERRIDES[slug]?.title as string) ?? titleize(slug),
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
    ...(MANUAL_OVERRIDES[slug] ?? {}),
  }

  return p
})

export const products: Product[] = baseProducts.map((p) => {
  const gallery = coverFirst(imageManifest[p.slug])
  const images = gallery?.length ? gallery : [p.image]
  return { ...p, image: images[0], images }
})

export const productsById   = Object.fromEntries(products.map((p) => [p.id,   p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
