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

/** Put any filename containing "cover" first. */
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p)
  return covers.length ? [...covers, ...others] : list
}

/** "my-awesome-pack" -> "My Awesome Pack" */
function titleize(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

/** Canonical category LABELS */
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
 * Heuristic category inference from folder slug.
 * Order matters: more specific first.
 */
function inferCategory(slug: string): string {
  const s = slug.toLowerCase()

  // Specific first
  if (/(religious|faith|bible|devotion(al)?|sermon|qur'?an|quran|islam|church|christ)/.test(s))
    return CATEGORY_LABELS.RELIGIOUS

  if (/(keto|low[- ]?carb)/.test(s))
    return CATEGORY_LABELS.KETO

  if (/(passive|side[- ]?hustle|income|freedom|wealth|make[- ]?money|as[- ]?you[- ]?sleep)/.test(s))
    return CATEGORY_LABELS.PASSIVE

  // Broad health (no generic "ebook" anymore)
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

  // Fallback (neutral)
  return CATEGORY_LABELS.ESSENTIALS
}

/**
 * Per-product overrides (exact titles/categories).
 * Add here whenever you want deterministic control.
 */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  // Proper casing / ampersands
  "ai-and-chatgpt-guides": { title: "AI & ChatGPT Guides", category: CATEGORY_LABELS.AI },
  "plr-and-mrr-bundles":  { title: "PLR & MRR Bundles", category: CATEGORY_LABELS.PLR },
  "keto-and-diet-guides": { title: "Keto & Diet Guides",  category: CATEGORY_LABELS.KETO },

  // Put these in Passive Income (and thus out of Essentials)
  "digital-wealth-ultimate-guide": { category: CATEGORY_LABELS.PASSIVE },
  "make-money-as-you-sleep":      { category: CATEGORY_LABELS.PASSIVE },
}

/**
 * Build products from manifest: one product per folder.
 */
const autoFromManifest: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug, i) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = (MANUAL_OVERRIDES[slug]?.category as string) ?? inferCategory(slug)

  const defaults: Omit<Product, "images"> = {
    id: 1000 + i,
    slug,
    // if you set a manual title, use it; otherwise titleize the slug
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
  }

  return { ...defaults, ...(MANUAL_OVERRIDES[slug] ?? {}) }
})

// Final export with gallery attached
export const products: Product[] = autoFromManifest.map((p) => {
  const fromManifest = coverFirst(imageManifest[p.slug])
  const images = fromManifest?.length ? fromManifest : [p.image]
  return { ...p, image: images[0], images }
})

export const productsById   = Object.fromEntries(products.map((p) => [p.id,   p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
