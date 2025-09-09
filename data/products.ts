// data/products.ts
import { imageManifest } from "./image-manifest"

export type Product = {
  id: number
  slug: string
  title: string
  description: string
  price: number
  originalPrice: number
  category: string
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image: string
  images?: string[] // gallery images (auto from manifest when available)
}

// --- helpers ---------------------------------------------------------------

// Put any filename containing "cover" (case-insensitive) first, keep the rest in the same order.
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list || list.length === 0) return list
  const covers: string[] = []
  const others: string[] = []
  for (const p of list) {
    if (/cover/i.test(p)) covers.push(p)
    else others.push(p)
  }
  return covers.length ? [...covers, ...others] : list
}

// --- base product data (image is a fallback if no manifest exists) ---------
const base: Omit<Product, "images">[] = [
  {
    id: 1,
    slug: "buy-this-complete-shop", // folder: public/images/products/buy-this-complete-shop/
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Ebooks, Courses, Prompts & More.",
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell ebooks, courses, prompts, templates, and more.",
    price: 42.99,
    originalPrice: 0,
    category: "Complete Shop Packages",
    tags: ["PLR", "MRR", "Bundle", "Resell Rights"],
    rating: 4.8,
    reviews: 210,
    downloads: 1500,
    bestseller: true,
    image: "/images/products/buy-this-complete-shop-cover.jpg",
  },
  {
    id: 2,
    slug: "the-art-of-giving-no-fucks", // folder: public/images/products/the-art-of-giving-no-fucks/
    title:
      "Self-Help Ebook: The Art of Giving No F*cks - Minimalist Mindset (Digital Download).",
    description:
      "A practical guide to focus, freedom, and owning your life—minimalist mindset strategies with worksheets.",
    price: 14.99,
    originalPrice: 0,
    category: "Self-Help & How-To",
    tags: ["Mindset", "Self-Help", "Focus", "Minimalism"],
    rating: 4.7,
    reviews: 112,
    downloads: 980,
    bestseller: true,
    image: "/images/products/the-art-of-giving-no-fucks-cover.jpg",
  },
  {
    id: 3,
    slug: "digital-wealth", // folder: public/images/products/digital-wealth/
    title:
      "Digital Wealth – Ultimate Guide - This Order Includes A Free Extra Bonus.",
    description:
      "Step-by-step strategies for building digital income streams. Includes a surprise bonus resource.",
    price: 28.99,
    originalPrice: 0,
    category: "Ebooks (Miscellaneous)",
    tags: ["Wealth", "Business", "Strategy", "Guide"],
    rating: 4.6,
    reviews: 95,
    downloads: 820,
    bestseller: false,
    image: "/images/products/digital-wealth-cover.jpg",
  },
  {
    id: 4,
    slug: "chatgpt-side-hustles", // folder: public/images/products/chatgpt-side-hustles/
    title:
      "ChatGPT Side Hustles eBook: 12 AI Income Streams - Beginner's PDF Guide (Digital Download).",
    description:
      "Beginner-friendly guide to 12 ChatGPT-powered side hustles with actionable steps and tools.",
    price: 2.99,
    originalPrice: 0,
    category: "AI & ChatGPT Guides",
    tags: ["AI", "ChatGPT", "Side Hustle", "Beginner"],
    rating: 4.5,
    reviews: 78,
    downloads: 640,
    bestseller: false,
    image: "/images/products/chatgpt-side-hustles-cover.jpg",
  },
  {
    id: 5,
    slug: "passive-income-financial-freedom", // folder: public/images/products/passive-income-financial-freedom/
    title: "Passive Income Ebook: Financial Freedom Guide (Digital Download)",
    description:
      "Learn foundational passive income strategies and systems to build long-term financial freedom.",
    price: 2.99,
    originalPrice: 0,
    category: "Passive Income & Side Hustles",
    tags: ["Passive Income", "Finance", "Freedom"],
    rating: 4.4,
    reviews: 66,
    downloads: 590,
    bestseller: false,
    image: "/images/products/make-money-as-you-sleep-cover.jpg",
  },
]

// --- attach manifest images & pick cover -----------------------------------
export const products: Product[] = base.map((p) => {
  const fromManifest = coverFirst(imageManifest[p.slug])
  const images = fromManifest?.length ? fromManifest : [p.image]
  return {
    ...p,
    image: images[0], // ensure the first (cover) is used as primary
    images,
  }
})

// Useful lookups (optional exports)
export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p]))
