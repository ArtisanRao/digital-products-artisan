// data/products.ts
import { imageManifest } from "./image-manifest";
import { normalizeCategoryLabel, labelToSlugAny, LEGACY_CATEGORY_MAP } from "./category-utils";

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;           // short blurb for cards/SEO
  longDescription?: string;      // detailed copy for quick-view & PDP
  price: number;
  originalPrice: number;
  category: string;              // always normalized on export
  categorySlug?: string;         // auto-filled from registry when possible
  tags: string[];
  rating: number;
  reviews: number;
  downloads: number;
  bestseller?: boolean;
  image: string;
  images?: string[];             // gallery images (from manifest)
  downloadPath?: string;         // repo-relative path under /private (e.g. "private/slug/file.pdf")
};

// Put any filename containing "cover" first
function coverFirst(list: string[] | undefined): string[] | undefined {
  if (!list?.length) return list;
  const covers: string[] = [];
  const others: string[] = [];
  for (const p of list) (/cover/i.test(p) ? covers : others).push(p);
  return covers.length ? [...covers, ...others] : list;
}

// ---------------------------------------------------------------------------
// RAW (un-normalized) product data. Keep as-is; normalization happens below.
// ---------------------------------------------------------------------------
const RAW_PRODUCTS: Omit<Product, "images" | "categorySlug">[] = [
  {
    id: 1,
    slug: "buy-this-complete-shop",
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Health & Fitness eBooks, Courses, Prompts & More.",
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell Health & Fitness eBooks, courses, prompts, Complete Shop Packages, and more.",
    longDescription: `✸ Buy my complete Shop with PLR / MRR Rights ✸ 

You have here the opportunity to buy my complete shop with a big discount!! This Bundle is way more worth than 100 USD!

Profit of my PLR+MRR Bundle for your business and clients.

The PLR license allows you to edit, rebrand and sell the products as your own product, making it an excellent addition to your product line or as a lead magnet to attract potential customers. With the MRR License you can resell the product as your own. The options are endless!!

In this bundle you will receive all products of my shop:

🚀 ChatGPT Expertise BASIC PACK Video Course
🚀 ChatGPT Expertise UPGRADE PACK Video Course
🚀 Make Money with AI Art Ebook
🚀 Make Money with AI Art Video
🚀 Create AI Human Reel Videos Video Course
🚀 PLR Chat GPT Video Course
🚀 10 Business & Marketing Video Courses PLR
🚀 100 Midjourney Prompts Abstract Art
🚀 Cryptocurrency Secrets Video Course and Ebook
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
🚀 AI Images Library
🚀 Effective Instagram Marketing
🚀 Blockchain Explained Ebook

After your order is processed, you will receive a PDF document with the links to download the files from Google Drive. This item is provided electronically.

This listing is for a digital download. No physical product will be shipped.

If you have any questions, please contact me and I will be more than happy to help!

🚀Check out my other PLR Products at my store🚀: https://www.etsy.com/shop/ArtisanRao?ref=dashboard-header`,
    price: 42.99,
    originalPrice: 0,
    category: "Complete Shop Packages",
    tags: ["PLR", "MRR", "Bundle", "Resell Rights"],
    rating: 4.8,
    reviews: 210,
    downloads: 1500,
    bestseller: true,
    image: "/images/products/buy-this-complete-shop/cover.jpg",
    downloadPath: "private/buy-this-complete-shop/main.pdf",
  },
  {
    id: 2,
    slug: "the-art-of-giving-no-fucks",
    title:
      "Self-Help Ebook: The Art of Giving No F*cks - Minimalist Mindset (Digital Download).",
    description:
      "A practical guide to focus, freedom, and owning your life—minimalist mindset strategies with worksheets.",
    longDescription: `A practical framework to stop people-pleasing and focus on what truly matters.

You’ll get:
• 120+ pages of concise lessons & mindset exercises  
• Printable worksheets & reflection prompts  
• Minimalist routines to reduce mental clutter

Details:
• Personal & light commercial use per product license
• Instant digital download (PDF)`,
    price: 14.99,
    originalPrice: 0,
    category: "Self-Help & How-To",
    tags: ["Mindset", "Self-Help", "Focus", "Minimalism"],
    rating: 4.7,
    reviews: 112,
    downloads: 980,
    bestseller: true,
    image: "/images/products/the-art-of-giving-no-fucks/cover.jpg",
    downloadPath: "private/the-art-of-giving-no-fucks/ebook.pdf",
  },
  {
    id: 3,
    slug: "digital-wealth-ultimate-guide",
    title:
      "Digital Wealth – Ultimate Guide - This Order Includes A Free Extra Bonus.",
    description:
      "Step-by-step strategies for building digital income streams. Includes a surprise bonus resource.",
    longDescription: `Build durable online income with actionable, beginner-friendly strategies.

Inside:
• Playbooks for products, funnels, audience & automation  
• Realistic growth plans and tools stack recommendations  
• Free bonus: quickstart checklist & Complete Shop Packages

Delivery:
• Instant digital download (PDF) — no shipping`,
    price: 28.99,
    originalPrice: 0,
    category: "Health & Fitness eBooks (Miscellaneous)",
    tags: ["Wealth", "Business", "Strategy", "Guide"],
    rating: 4.6,
    reviews: 95,
    downloads: 820,
    bestseller: false,
    image: "/images/products/digital-wealth-ultimate-guide/cover.jpg",
    downloadPath: "private/digital-wealth-ultimate-guide/guide.pdf",
  },
  {
    id: 4,
    slug: "chatgpt-side-hustles",
    title:
      "ChatGPT Side Hustles eBook: 12 AI Income Streams - Beginner's PDF Guide (Digital Download).",
    description:
      "Beginner-friendly guide to 12 ChatGPT-powered side hustles with actionable steps and tools.",
    longDescription: `Discover 12 proven AI-assisted side hustles you can start this week.

Includes:
• Step-by-step setup guides and pricing ideas  
• Prompt packs and tool suggestions  
• Simple marketing tips to land first customers

Format & access:
• PDF download delivered instantly after purchase`,
    price: 2.99,
    originalPrice: 0,
    category: "AI & ChatGPT Guides",
    tags: ["AI", "ChatGPT", "Side Hustle", "Beginner"],
    rating: 4.5,
    reviews: 78,
    downloads: 640,
    bestseller: false,
    image: "/images/products/chatgpt-side-hustles/cover.jpg",
    downloadPath: "private/chatgpt-side-hustles/ebook.pdf",
  },
  {
    id: 5,
    slug: "make-money-as-you-sleep",
    title:
      "Make Money As You Sleep: Financial Freedom Guide - Passive Income Ebook (Digital Download)",
    description:
      "Learn foundational passive income strategies and systems to build long-term financial freedom.",
    longDescription: `Set up income systems that work even when you don’t.

You’ll learn:
• Evergreen product ideas and distribution channels  
• Automations for delivery, payment and support  
• Risk-reduction and compounding strategies

Instant digital download; read on any device.`,
    price: 2.99,
    originalPrice: 0,
    category: "Passive Income & Side Hustles",
    tags: ["Passive Income", "Finance", "Freedom"],
    rating: 4.4,
    reviews: 66,
    downloads: 590,
    bestseller: false,
    image: "/images/products/make-money-as-you-sleep/cover.jpg",
    downloadPath: "private/make-money-as-you-sleep/book.pdf",
  },
];

// ---------------------------------------------------------------------------
// NORMALIZED export (safety net): categories & slugs are canonical here.
// Also attaches image-manifest galleries and picks a cover.
// ---------------------------------------------------------------------------
export const products: Product[] = RAW_PRODUCTS.map((p) => {
  const newLabel = normalizeCategoryLabel(p.category);
  const ensuredSlug =
    labelToSlugAny(p.category) ?? labelToSlugAny(newLabel);

  // dev warning to help you gradually clean up RAW_PRODUCTS
  if (process.env.NODE_ENV !== "production" && p.category in LEGACY_CATEGORY_MAP) {
    // eslint-disable-next-line no-console
    console.warn("[LegacyCategory] Normalized:", {
      id: p.id,
      title: p.title,
      oldLabel: p.category,
      normalizedTo: newLabel,
      slug: ensuredSlug,
    });
  }

  const fromManifest = coverFirst(imageManifest[p.slug]);
  const images = fromManifest?.length ? fromManifest : [p.image];

  return {
    ...p,
    category: newLabel,
    categorySlug: ensuredSlug,
    image: images[0],
    images,
  };
});

export const productsById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<number, Product>;
export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<string, Product>;
