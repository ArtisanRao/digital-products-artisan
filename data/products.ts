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
  category: string           // category LABEL
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string
  images?: string[]
  downloadPath?: string
}

function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p)
  return covers.length ? [...covers, ...others] : list
}

function titleize(slug: string): string {
  const base = slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
  // fix acronyms / expected casing & symbols for known category-like names
  return base
    .replace(/\bAi\b/g, "AI")
    .replace(/\bChatgpt\b/g, "ChatGPT")
    .replace(/\bPlr\b/g, "PLR")
    .replace(/\bMrr\b/g, "MRR")
    .replace(/\bEbooks\b/g, "eBooks")
    // targeted title improvements
    .replace(/^Ai And Chatgpt Guides$/i, "AI & ChatGPT Guides")
    .replace(/^Plr And Mrr Bundles$/i, "PLR & MRR Bundles")
    .replace(/^Keto And Diet Guides$/i, "Keto & Diet Guides")
}

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

// ⚠️ Put KETO check before HEALTH so it doesn’t fall into Health by accident.
function inferCategory(slug: string): string {
  const s = slug.toLowerCase()
  if (/(ai|chatgpt|gpt|prompt)/.test(s)) return CATEGORY_LABELS.AI
  if (/(planner|journal|productivity|organizer|notion|tracker)/.test(s)) return CATEGORY_LABELS.PLANNERS
  if (/(self[- ]?help|how[- ]?to|mindset|habit|routine)/.test(s)) return CATEGORY_LABELS.SELF_HELP
  if (/(plr|mrr|bundle|resell|resale)/.test(s)) return CATEGORY_LABELS.PLR
  if (/(video|course|training|lesson)/.test(s)) return CATEGORY_LABELS.VIDEO
  if (/(complete[- ]?shop|shop[- ]?package|storefront|store[- ]?bundle)/.test(s)) return CATEGORY_LABELS.SHOP
  if (/(keto|low[- ]?carb)/.test(s)) return CATEGORY_LABELS.KETO            // ← precedes HEALTH
  if (/(health|fitness|wellness|diet|nutrition|ebook)/.test(s)) return CATEGORY_LABELS.HEALTH
  if (/(passive|side[- ]?hustle|income|freedom)/.test(s)) return CATEGORY_LABELS.PASSIVE
  if (/(web[- ]?template|template|ui[- ]?kit|theme)/.test(s)) return CATEGORY_LABELS.WEB
  if (/(essential|toolkit|utilities|automation|prompt[- ]?pack)/.test(s)) return CATEGORY_LABELS.ESSENTIALS
  if (/(social[- ]?media|instagram|pinterest|facebook|tiktok|brand(ing)?[- ]?kit)/.test(s)) return CATEGORY_LABELS.SOCIAL
  if (/(font|typeface|icons?)/.test(s)) return CATEGORY_LABELS.FONTS_ICONS
  if (/(religious|faith|bible|devotional|devotion(al)?|sermon)/.test(s)) return CATEGORY_LABELS.RELIGIOUS
  return CATEGORY_LABELS.ESSENTIALS
}

/** Hand fixes / one-offs */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  "ai-and-chatgpt-guides": { title: "AI & ChatGPT Guides", category: CATEGORY_LABELS.AI },
  "plr-and-mrr-bundles":   { title: "PLR & MRR Bundles",   category: CATEGORY_LABELS.PLR },
  "keto-and-diet-guides":  { title: "Keto & Diet Guides",  category: CATEGORY_LABELS.KETO },

  // Remove from Digital Essentials: send to Passive Income instead
  "digital-wealth-ultimate-guide": { category: CATEGORY_LABELS.PASSIVE },
}

const autoFromManifest: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug, i) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = inferCategory(slug)
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

export const products: Product[] = autoFromManifest.map((p) => {
  const fromManifest = coverFirst(imageManifest[p.slug])
  const images = fromManifest?.length ? fromManifest : [p.image]
  return { ...p, image: images[0], images }
})

export const productsById  = Object.fromEntries(products.map((p) => [p.id, p])) as Record<number, Product>
export const productsBySlug= Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
