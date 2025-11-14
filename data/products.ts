import { imageManifest } from "./image-manifest"

export type Product = {
  id: number
  slug: string
  title: string
  description: string
  longDescription?: string
  price: number
  /** Optional EUR price for DE feed / EUR landing pages */
  priceEUR?: number
  /** Full pre-discount price in USD (used for strikethrough “was” price) */
  originalPrice: number
  category: string // canonical Category LABEL (not slug)
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string
  images?: string[]
  /** Relative to /private (e.g., "files/passive-income-ebook.pdf") */
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

/** Base defaults BEFORE sale discount. */
const DEFAULT_PRICE = 9.99 as number
const DEFAULT_ORIGINAL_PRICE = DEFAULT_PRICE

/** Global store-wide discount (e.g., 0.5 = 50% off everything). */
const GLOBAL_DISCOUNT = 0.5 as number

/** Hide these category-landing entries from the All Products feed */
const HIDE_FROM_ALL_PRODUCTS = new Set<string>([
  "self-help-and-how-to",
  "social-media-kits",
  "planners-and-productivity",
  "passive-income-and-side-hustles",
  "fonts-and-icons",
  "health-and-fitness-ebooks",
  "digital-essentials-hub",
  "complete-shop-packages",
  "web-templates",
  "video-courses-and-training",
])

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
 * BASE price overrides by SLUG (USD) – these are *pre-discount* prices.
 * The GLOBAL_DISCOUNT is applied later when building the final products.
 */
const PRICE_BY_SLUG: Record<string, number> = {
  // existing entries
  "chatgpt-side-hustles": 2.99,
  "make-money-as-you-sleep": 2.99,
  "faceless-marketing": 2.99,
  "digital-wealth": 28.99,
  "digital-wealth-ultimate-guide": 28.99,
  "cybersecurity-trinity": 12.99,
  "85-million-plus": 2.99,
  "beginners-guide-to-boolean": 9.99,
  "the-art-of-not-giving-a-fuck": 9.99,
  "plr-mrr-digital-products": 39.99,
  "the-exorcist-tradition": 4.99,
  "cryptocurrency-secrets": 2.99,
  "plr-keto-diet-secrets": 1.99,
  "100-christmas-digital-products": 1.99,
  "passive-income-ebook": 2.99,
  "eating-healthy-ebook": 6.99,
  "ai-and-chatgpt-guides": 1.99, // category landing card
  "chatgpt-side-hustles-v2": 1.99, // optional second variant
  "the-art-of-giving-no-fucks": 9.99, // alias used in featured

  // NEW explicit prices for your 8 items (where not already present)
  "12-chatgpt-ai-side-streams": 2.99,
  "faceless-digital-marketing-plr-bundle": 2.99,
  "easy-way-to-build-30000-a-year-passive-income": 2.99,

  // Buy This Complete Shop (pre-discount price)
  "buy-this-complete-shop": 42.99,
}

/** BASE EUR price overrides by SLUG (pre-discount, for DE/EUR pages) */
const PRICE_EUR_BY_SLUG: Record<string, number> = {
  "complete-shop-with-plr-mrr-rights": 39.99,
  "the-art-of-giving-no-fucks": 13.99,
  "digital-wealth-ultimate-guide": 17.99,
  "chatgpt-side-hustles": 16.99,
  "passive-income-ebook": 11.99,
  // match main shop price
  "buy-this-complete-shop": 42.99,
}

/** Price overrides by TITLE (USD fallback, pre-discount) */
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
  [normTitle("Chatgpt Side Hustles")]: 1.99,
  [normTitle("The Art Of Giving No Fucks")]: 9.99,
}

/**
 * Deterministic overrides for titles/categories and per-product content.
 * (Non-price fields live here; price is applied below to keep logic centralized.)
 */
const MANUAL_OVERRIDES: Record<string, Partial<Product>> = {
  // Category landing niceties (if you have folders named like these)
  "ai-and-chatgpt-guides": { title: "AI & ChatGPT Guides", category: CATEGORY_LABELS.AI },

  // Rename PLR & MRR Bundles entry + price
  "plr-and-mrr-bundles": {
    title: "85 Million+ Ultimate PLR MRR Bundle Ideal for Passive Income $2.99",
    category: CATEGORY_LABELS.PLR,
    price: 2.99,
  },

  // Keto & Diet Guides landing price
  "keto-and-diet-guides": { title: "Keto & Diet Guides", category: CATEGORY_LABELS.KETO, price: 1.99 },

  // Religious Ebooks landing rename
  "religious-ebooks": { title: "The Exorcist Tradition", category: CATEGORY_LABELS.RELIGIOUS, price: 4.99 },

  // Put “wealth” / “as-you-sleep” in Passive Income (not Essentials)
  "digital-wealth": { category: CATEGORY_LABELS.PASSIVE },

  // ✅ Digital Wealth Toolkit (slug stays the same; content becomes toolkit)
  "digital-wealth-ultimate-guide": {
    title: "Digital Wealth System Toolkit – Online Income Templates & Resources Pack",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["digital wealth", "income systems", "templates", "toolkit", "planning"],
    description:
      "A complete toolkit with templates, worksheets, planners and resources to help you build your online income systems.",
    longDescription: `The Digital Wealth System Toolkit gives you the tools you need to build and optimize multiple online income streams.

Instead of just reading theory, you get practical worksheets, planners, templates and trackers you can start using immediately.

Inside you’ll find:
• 6 Digital wealth worksheets
• 3 planners (income, goals, monthly/weekly focus)
• Income tracker (Excel + Google Sheets)
• 5 editable Canva templates
• A system roadmap (PNG + PDF)
• Bonus: Digital Wealth Guide as a PDF reference

This is a multi-file toolkit, not just a single ebook.`,
    downloadPath: "files/digital-wealth-system-toolkit.zip",
  },

  // ✅ Make Money As You Sleep Toolkit
  "make-money-as-you-sleep": {
    title: "Make Money As You Sleep – Nighttime Income Automation Toolkit",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["automation", "passive income", "toolkit", "workflows", "blueprints"],
    description:
      "A practical toolkit with templates, checklists and automation workflows to build income streams that earn while you sleep.",
    longDescription: `This toolkit helps you design income systems that keep working even when you’re offline.

You get:
• 5 side hustle blueprints
• 2 editable Canva templates
• Income automation flowchart
• 3 detailed checklists (setup, workflow, monitoring)
• Morning & evening productivity planners
• Bonus: Make Money As You Sleep PDF as a reference guide

Delivered as a multi-file bundle (toolkit), not a stand-alone ebook.`,
    downloadPath: "files/make-money-as-you-sleep-toolkit.zip",
  },

  // Force the “Art of …” product into Self-Help (cover both slug variants)
  "the-art-of-not-giving-a-fuck": {
    title: "The Art Of Giving No Fucks",
    category: CATEGORY_LABELS.SELF_HELP,
    price: 9.99,
  },
  "the-art-of-giving-no-fucks": {
    title: "The Art Of Giving No Fucks",
    category: CATEGORY_LABELS.SELF_HELP,
    price: 9.99,
  },

  // ✸ Complete Shop with PLR / MRR Rights (price + secure download)
  "complete-shop-with-plr-mrr-rights": {
    title: "✸ Buy my complete Shop with PLR / MRR Rights ✸",
    category: CATEGORY_LABELS.SHOP,
    bestseller: true,
    price: 42.99,
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
    downloadPath: "files/complete-shop-with-plr-mrr-rights.pdf",
  },

  // ✅ Buy This Complete Shop – main toolkit listing (separate from Etsy-style one above)
  "buy-this-complete-shop": {
    title: "Buy This Complete Shop – PLR Digital Business Kit",
    category: CATEGORY_LABELS.SHOP,
    bestseller: true,
    tags: ["PLR", "MRR", "complete shop", "digital business", "bundle"],
    description:
      "Launch a complete digital products store instantly. Includes PLR products, templates, marketing materials and everything you need to start selling today.",
    longDescription: `Start selling digital products immediately with this complete PLR digital business kit.

Inside you get:
• A full collection of done-for-you digital products
• Editable Canva templates and mockups
• Store graphics and branding assets
• Product descriptions and copy you can reuse
• PLR + MRR license so you can rebrand and resell

It’s a multi-file toolkit (ZIP), not a single ebook. Download, customize, upload and start selling.`,
    downloadPath: "files/buy-this-complete-shop.zip",
  },

  // ---------------------------------------------------------------------------
  // YOUR 8 NEW PRODUCTS: Titles, Category LABELS, tags, and secure downloadPath
  // ---------------------------------------------------------------------------

  "100-christmas-digital-products": {
    title: "100 Christmas Digital Product Ideas to Sell Online",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["ideas", "christmas", "etsy", "passive income", "side hustles"],
    downloadPath: "files/100-christmas-digital-products.pdf",
  },

  "12-chatgpt-ai-side-streams": {
    title: "12 ChatGPT AI Side Streams",
    category: CATEGORY_LABELS.AI,
    tags: ["AI", "ChatGPT", "side income", "automation", "prompts"],
    downloadPath: "files/12-chatgpt-ai-side-streams.pdf",
  },

  "cryptocurrency-secrets": {
    title: "Cryptocurrency Secrets Ebook & Videos",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["crypto", "trading", "finance", "passive income", "video course"],
    downloadPath: "files/cryptocurrency-secrets.pdf",
  },

  "eating-healthy-ebook": {
    title: "Eating Healthy Premium EBook & Complete Video Course",
    category: CATEGORY_LABELS.KETO,
    tags: ["health", "diet", "nutrition", "video course", "PLR"],
    downloadPath: "files/eating-healthy-ebook.pdf",
  },

  "faceless-digital-marketing-plr-bundle": {
    title: "Faceless Digital Marketing Guide Bundle Template — PLR Digital Product Bundle",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["PLR", "digital marketing", "templates", "bundle", "faceless brand"],
    downloadPath: "files/faceless-digital-marketing-plr-bundle.pdf",
  },

  "plr-keto-diet-secrets": {
    title: "Keto Diet Secrets — Ebook, Sales Website & More (Master Resell Rights)",
    category: CATEGORY_LABELS.KETO,
    tags: ["keto", "diet", "MRR", "PLR", "sales page"],
    downloadPath: "files/plr-keto-diet-secrets.pdf",
  },

  "cybersecurity-trinity": {
    title: "The Cybersecurity Trinity",
    category: CATEGORY_LABELS.SELF_HELP,
    tags: ["security", "privacy", "how-to", "guides"],
    downloadPath: "files/cybersecurity-trinity.pdf",
  },

  // ✅ Passive Income Builder Toolkit – new positioning
  "easy-way-to-build-30000-a-year-passive-income": {
    title: "Passive Income Builder Toolkit – $30,000/Year Action System",
    category: CATEGORY_LABELS.PASSIVE,
    tags: ["passive income", "systems", "wealth", "side hustle", "toolkit"],
    description:
      "Step-by-step templates, worksheets, checklists and tools for building passive income streams up to $30,000 per year.",
    longDescription: `Turn your passive income goals into a structured action system.

This toolkit includes:
• Passive income roadmap (PNG/PDF)
• 4 business model templates
• Startup, automation and scaling checklists
• Revenue tracker (Excel)
• Goal planner (PDF)
• Bonus: Passive Income Strategy PDF as a reference

Delivered as a multi-file toolkit (ZIP), not just a single ebook.`,
    downloadPath: "files/passive-income-builder-toolkit.zip",
  },
}

/** Build products from the image manifest (one per folder). */
const baseProducts: Omit<Product, "images">[] = Object.keys(imageManifest).map((slug) => {
  const gallery = coverFirst(imageManifest[slug])
  const category = (MANUAL_OVERRIDES[slug]?.category as string) ?? inferCategory(slug)

  const p: Omit<Product, "images"> = {
    id: stableId(slug),
    slug,
    title: (MANUAL_OVERRIDES[slug]?.title as string) ?? titleize(slug),
    description: (MANUAL_OVERRIDES[slug]?.description as string) ?? `A curated digital product in ${category}.`,
    longDescription: MANUAL_OVERRIDES[slug]?.longDescription,
    price: DEFAULT_PRICE,
    originalPrice: DEFAULT_ORIGINAL_PRICE,
    category,
    tags: MANUAL_OVERRIDES[slug]?.tags ?? [],
    rating: 0,
    reviews: 0,
    downloads: 0,
    bestseller: MANUAL_OVERRIDES[slug]?.bestseller ?? false,
    image: gallery?.[0] ?? `/images/products/${slug}/cover.jpg`,
    downloadPath: MANUAL_OVERRIDES[slug]?.downloadPath,
  }

  // Apply base price overrides (USD)
  if (Object.prototype.hasOwnProperty.call(PRICE_BY_SLUG, slug)) {
    p.price = PRICE_BY_SLUG[slug]
  } else {
    const key = normTitle(p.title)
    if (Object.prototype.hasOwnProperty.call(PRICE_BY_TITLE, key)) {
      p.price = PRICE_BY_TITLE[key]
    }
  }

  // Apply any manual per-product price override defined directly in MANUAL_OVERRIDES
  if (typeof MANUAL_OVERRIDES[slug]?.price === "number") {
    p.price = MANUAL_OVERRIDES[slug]!.price as number
  }

  // EUR base price override (before discount)
  let eurBase: number | undefined
  if (Object.prototype.hasOwnProperty.call(PRICE_EUR_BY_SLUG, slug)) {
    eurBase = PRICE_EUR_BY_SLUG[slug]
  }

  // Now compute originalPrice + global discount (USD & EUR)
  const baseUSD = typeof p.price === "number" ? p.price : DEFAULT_PRICE
  p.originalPrice = baseUSD
  p.price = Number((baseUSD * GLOBAL_DISCOUNT).toFixed(2))

  if (typeof eurBase === "number") {
    p.priceEUR = Number((eurBase * GLOBAL_DISCOUNT).toFixed(2))
  }

  return p
})

export const products: Product[] = baseProducts
  .map((p) => {
    const gallery = coverFirst(imageManifest[p.slug])
    const images = gallery?.length ? gallery : [p.image]
    return { ...p, image: images[0], images }
  })
  // 🚫 Hide certain category-landing entries from the All Products page
  .filter((p) => !HIDE_FROM_ALL_PRODUCTS.has(p.slug))

/** Helper: select by category label (keeps Categories in sync with All Products). */
export function productsInCategory(categoryLabel: string): Product[] {
  return products.filter((p) => p.category === categoryLabel)
}

export const productsById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<number, Product>
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>

/** Optional helper if you ever want a single-source price picker */
export function priceForCurrency(p: Product, currency: "USD" | "EUR" | "GBP" = "USD"): number {
  if (currency === "EUR" && typeof p.priceEUR === "number") return p.priceEUR
  // (GBP not set — fall back to USD)
  return p.price
}
