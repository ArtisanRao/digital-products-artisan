import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

const base = "https://digitalproductsartisan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    "/", "/about", "/contact", "/products", "/categories",
    "/bestsellers", "/returns", "/search", "/signup", "/support",
    "/templates-and-graphics", "/terms-of-service", "/thank-you",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryPaths: MetadataRoute.Sitemap = CATEGORIES.map((c: any) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productPaths: MetadataRoute.Sitemap = (products as any[]).map((p) => ({
    url: `${base}/products/${p.slug ?? p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPaths, ...categoryPaths, ...productPaths];
}
