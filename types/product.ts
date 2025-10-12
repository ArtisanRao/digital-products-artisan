// types/product.ts

export type LicenseType =
  | "Personal"
  | "Commercial"
  | "PLR"
  | "MRR"
  | "RR"
  | "MIT"
  | "GPL"
  | string;

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Product {
  /** URL slug, e.g. "ai-and-chatgpt-guides" */
  slug: string;
  /** Display title */
  title: string;
  /** Price in your smallest currency unit or number */
  price: number | string;

  // Optional marketing/content fields used throughout the app
  shortDescription?: string;
  description?: string;
  features?: string[];
  includes?: string[];
  license?: LicenseType;
  tags?: string[];

  // Media
  images?: string[];
  coverImage?: string;
  heroImage?: string;

  // Misc
  rating?: number;
  downloads?: number;
  seo?: SEO;

  // Allow extra per-product props without breaking types
  [key: string]: unknown;
}
