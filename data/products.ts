// data/products.ts
import { imageManifest } from "./image-manifest"

export type Product = {
  id: number
  slug: string
  title: string
  description: string            // short blurb for cards/SEO
  longDescription?: string       // detailed copy for quick-view & PDP
  price: number
  originalPrice: number
  category: string               // MUST match your category LABELS (not slugs)
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string                  // primary image (usually the "cover")
  images?: string[]              // gallery from manifest
  downloadPath?: string          // e.g. "private/<slug>/file.pdf" or ".zip"
}

/** Put any filename containing "cover" first. */
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p)
  return covers.length ? [...covers, ...others] : list
}

/** Convert "my-awesome-pack" -> "My Awesome Pack" */
function titleize(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

/** Your canonical category LABELS (exactly these strings): */
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
 * You can add/adjust patterns as you like.
 */
function inferCategory(slug: string): string {
  const s = slug.toLowerCase()

  if (/(ai|chatgpt|gpt|prompt)/.test(s)) return CATEGORY_LABELS.AI
  if (/(planner|journal|productivity|organizer|notion|tracker)/.test(s)) return CATEGORY_LABELS.PLANNERS
  if (/(self[- ]?help|how[- ]?to|mindset|habit|routine)/.test(s)) return CATEGORY_LABELS.SELF_HELP
  if (/(plr|mrr|bundle|resell|resale)/.test(s)) return CATEGORY_LABELS.PLR
  if (/(video|course|training|lesson)/.test(s)) return CATEGORY_LABELS.VIDEO
  if (/(complete[- ]?shop|shop[- ]?package|storefront|store[- ]?bundle)/.test(s)) return CATEGORY_LABELS.SHOP
  if (/(health|fitness|wellness|diet|nutrition|ebook)/.test(s)) return CATEGORY_LABELS.HEALTH
  if (/(keto|low[- ]?carb)/.test(s)) return CATEGORY_LABELS.KETO
  if (/(passive|side[- ]?hustle|income|freedom)/.test(s)) return CATEGORY_LABELS.PASSIVE
  if (/(web[- ]?template|template|ui[- ]?kit|theme)/.test(s)) return CATEGORY_LABELS.WEB
  if (/(essential|toolkit|utilities|automation|prompt[- ]?pack)/.test(s)) return CATEGORY_LABELS.ESSENTIALS
  if (/(social[- ]?media|instagram|pinterest|facebook|tiktok|brand(ing)?[- ]?kit)/.test(s)) return CATEGORY_LABELS.SOCIAL
  if (/(font|typeface|icons?)/.test(s)) return CATEGORY_LABELS.FONTS_ICONS
  if (/(religious|faith|bible|devotional|devotion(al)?|sermon)/.test(s)) return CATEGORY_LABELS.RELIGIOUS

  // Fallback: pick something neutral
  return CATEGORY_LABELS.ESSENTIALS
}

/**
 * Optional per-product overrides.
 * Keyed by product slug. Use this to set exact title/price/category/description/downloadPath, etc.
 * Add entries here for any product that needs custom values beyond the heuristic defaults.
 */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  // "buy-this-complete-shop": {
  //   title: "Buy This Complete Shop - PLR/MRR Bundle",
  //   price: 42.99,
  //   category: CATEGORY_LABELS.SHOP,
  //   longDescription: "...",
  //   downloadPath: "private/buy-this-complete-shop/main.pdf",
  //   bestseller: true,
  // },
}

/**
 * Build products from the manifest: one product per folder key.
 * The prebuild script guarantees imageManifest[slug] contains absolute URLs like
 *   /images/products/<slug>/<file>
 */
const autoFromManifest: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug, i) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = inferCategory(slug)

  const defaults: Omit<Product, "images"> = {
    id: 1000 + i, // ensure unique; you can change to your own id scheme
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
    // Set per-product in MANUAL_OVERRIDES if you have a real file to deliver:
    // downloadPath: `private/${slug}/file.pdf`
  }

  return { ...defaults, ...(MANUAL_OVERRIDES[slug] ?? {}) }
})

// Final export with gallery attached
export const products: Product[] = autoFromManifest.map((p) => {
  const fromManifest = coverFirst(imageManifest[p.slug])
  const images = fromManifest?.length ? fromManifest : [p.image]
  return { ...p, image: images[0], images }
})

export const productsById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>
