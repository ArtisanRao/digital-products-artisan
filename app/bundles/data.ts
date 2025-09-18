// components/bundles/data.ts
export type Bundle = {
  slug: string;                 // used in the URL
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  rating: number;
  reviews: number;
  downloads: number;
  itemCount: number;
  items: string[];
  image: string;
  popular?: boolean;
};

export const bundles: Bundle[] = [
  {
    slug: "complete-creator-bundle",
    title: "Complete Creator Bundle",
    description: "Everything you need to start and grow your creative business",
    price: 79.99,
    originalPrice: 149.99,
    savings: 47,
    rating: 4.9,
    reviews: 156,
    downloads: 890,
    itemCount: 8,
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
    image: "/images/bundles/complete-creator-bundle-cover.jpg",
    popular: true,
  },
  {
    slug: "social-media-master-pack",
    title: "Social Media Master Pack",
    description: "Templates and guides for dominating social media platforms",
    price: 49.99,
    originalPrice: 89.99,
    savings: 44,
    rating: 4.8,
    reviews: 203,
    downloads: 567,
    itemCount: 5,
    items: [
      "Instagram Story Templates",
      "Facebook Post Templates",
      "LinkedIn Content Kit",
      "Social Media Strategy Guide",
      "Hashtag Research Tool",
    ],
    image: "/images/bundles/social-media-master-pack-cover.jpg",
  },
  {
    slug: "business-starter-bundle",
    title: "Business Starter Bundle",
    description: "Essential tools and resources for new entrepreneurs",
    price: 59.99,
    originalPrice: 119.99,
    savings: 50,
    rating: 4.7,
    reviews: 134,
    downloads: 445,
    itemCount: 6,
    items: [
      "Business Plan Template",
      "Financial Planning Spreadsheet",
      "Legal Document Templates",
      "Marketing Strategy Guide",
      "Pitch Deck Template",
      "Brand Guidelines Template",
    ],
    image: "/images/bundles/business-starter-bundle-cover.jpg",
  },
  {
    slug: "ai-productivity-suite",
    title: "AI Productivity Suite",
    description: "Harness the power of AI for maximum productivity",
    price: 39.99,
    originalPrice: 79.99,
    savings: 50,
    rating: 4.9,
    reviews: 298,
    downloads: 1100,
    itemCount: 4,
    items: [
      "Ultimate AI Prompt Pack",
      "ChatGPT Workflow Templates",
      "AI Writing Assistant Guide",
      "Automation Setup Templates",
    ],
    image: "/images/bundles/ai-productivity-suite-cover.jpg",
    popular: true,
  },
];
