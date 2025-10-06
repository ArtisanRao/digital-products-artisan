import type { Bundle as CatalogBundle } from "@/app/bundles/data";
import { bundles as catalogBundles } from "@/app/bundles/data";

export type Bundle = {
  slug: string;                 // used in the URL
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;              // % off, rounded (derived)
  rating: number;
  reviews: number;
  downloads: number;
  itemCount: number;            // derived
  items: string[];
  image: string;
  popular?: boolean;
};

function pctSavings(original: number, price: number): number {
  if (!(original > 0) || !(price >= 0) || price >= original) return 0;
  return Math.max(0, Math.min(100, Math.round(((original - price) / original) * 100)));
}

export const bundles: Bundle[] = (catalogBundles as CatalogBundle[]).map((b) => {
  const original = b.originalPrice ?? 0;
  const price = b.price ?? 0;
  return {
    slug: b.slug,
    title: b.title,
    description: b.description ?? "",
    price,
    originalPrice: original,
    savings: pctSavings(original, price),
    rating: (b as any).rating ?? 0,
    reviews: (b as any).reviews ?? 0,
    downloads: (b as any).downloads ?? 0,
    itemCount: Array.isArray(b.items) ? b.items.length : 0,
    items: b.items ?? [],
    image: b.image,
    popular: (b as any).popular ?? false,
  };
});

export const bundlesBySlug = Object.fromEntries(
  bundles.map((b) => [b.slug, b] as const)
) as Record<string, Bundle>;
