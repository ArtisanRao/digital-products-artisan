// app/bundles/data.ts
export type Bundle = {
  slug: string;
  title: string;
  description?: string;
  short?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  items?: string[];
  rating?: number;
  reviews?: number;
  downloads?: number;
  popular?: boolean;
};

export const bundles: Bundle[] = [
  {
    slug: "complete-creator-bundle",
    title: "Complete Creator Bundle",
    description: "Everything you need to start and grow your creative business.",
    price: 79.99,
    originalPrice: 149.99,
    image: "/images/bundles/complete-creator-bundle-cover.jpg",
    images: ["/images/bundles/complete-creator-bundle-cover.jpg"],
    items: [
      "Ultimate AI Prompt Pack",
      "Canva Template Bundle",
      "Digital Marketing Ebook",
      "Notion Productivity System",
      "Instagram Story Templates",
      "Brand Identity Kit",
      "Content Calendar Template",
      "Email Marketing Templates",
    ],
    rating: 4.9,
    reviews: 156,
    downloads: 890,
    popular: true,
  },
  {
    slug: "social-media-master-pack",
    title: "Social Media Master Pack",
    description: "Templates and guides for dominating social media platforms.",
    price: 49.99,
    originalPrice: 89.99,
    image: "/images/bundles/social-media-master-pack-cover.jpg",
    images: ["/images/bundles/social-media-master-pack-cover.jpg"],
    items: [
      "Instagram Story Templates",
      "Facebook Post Templates",
      "LinkedIn Content Kit",
      "Social Media Strategy Guide",
      "Hashtag Research Tool",
    ],
    rating: 4.8,
    reviews: 203,
    downloads: 567,
  },
  {
    slug: "business-starter-bundle",
    title: "Business Starter Bundle",
    description: "Essential tools and resources for new entrepreneurs.",
    price: 59.99,
    originalPrice: 119.99,
    image: "/images/bundles/business-starter-bundle-cover.jpg",
    images: ["/images/bundles/business-starter-bundle-cover.jpg"],
    items: [
      "Business Plan Template",
      "Financial Planning Spreadsheet",
      "Legal Document Templates",
      "Marketing Strategy Guide",
      "Pitch Deck Template",
      "Brand Guidelines Template",
    ],
    rating: 4.7,
    reviews: 134,
    downloads: 445,
  },
  {
    slug: "ai-productivity-suite",
    title: "AI Productivity Suite",
    description: "Harness the power of AI for maximum productivity.",
    price: 39.99,
    originalPrice: 79.99,
    image: "/images/bundles/ai-productivity-suite-cover.jpg",
    images: ["/images/bundles/ai-productivity-suite-cover.jpg"],
    items: [
      "Ultimate AI Prompt Pack",
      "ChatGPT Workflow Templates",
      "AI Writing Assistant Guide",
      "Automation Setup Templates",
    ],
    rating: 4.9,
    reviews: 298,
    downloads: 1100,
    popular: true,
  },
];

export const bundlesBySlug = Object.fromEntries(
  bundles.map((b) => [b.slug, b] as const)
) as Record<string, Bundle>;
