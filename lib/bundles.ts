// lib/bundles.ts
export type Bundle = {
  id: string;
  title: string;
  blurb: string;
  productsCount: number;
  rating: number;        // e.g., 4.9
  reviews: number;       // e.g., 203
  cover: string;         // public path to the cover image
  discountPct?: number;  // optional "-47%" badge
  badge?: "Most Popular" | "New" | "Best Value";
};

export const BUNDLES: Bundle[] = [
  {
    id: "complete-creator-bundle",
    title: "Complete Creator Bundle",
    blurb: "Everything you need to start and grow your creative business.",
    productsCount: 8,
    rating: 4.9,
    reviews: 156,
    cover: "/images/bundles/complete-creator-bundle-cover.jpg",
    discountPct: 47,
    badge: "Most Popular",
  },
  {
    id: "social-media-master-pack",
    title: "Social Media Master Pack",
    blurb: "Templates and guides for dominating social media platforms.",
    productsCount: 5,
    rating: 4.8,
    reviews: 203,
    cover: "/images/bundles/social-media-master-pack-cover.jpg",
    discountPct: 44,
  },
  {
    id: "business-starter-bundle",
    title: "Business Starter Bundle",
    blurb: "Essential tools and resources for new entrepreneurs.",
    productsCount: 6,
    rating: 4.7,
    reviews: 134,
    cover: "/images/bundles/business-starter-bundle-cover.jpg",
    discountPct: 50,
  },
  {
    id: "ai-productivity-suite",
    title: "AI Productivity Suite",
    blurb: "Harness the power of AI for maximum productivity.",
    productsCount: 4,
    rating: 4.9,
    reviews: 298,
    cover: "/images/bundles/ai-productivity-suite-cover.jpg",
    discountPct: 50,
    badge: "Most Popular",
  },
];
