// app/sitemap.ts
import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { CATEGORIES } from "@/data/categories";

const base = "https://digitalproductsartisan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /** -----------------------------
   *  Static Pages
   *  ----------------------------- */
  const staticPaths: MetadataRoute.Sitemap = [
    "/", "/about", "/contact", "/products", "/categories",
    "/bestsellers", "/returns", "/search", "/signup", "/support",
    "/templates-and-graphics", "/terms-of-service", "/privacy-policy", "/thank-you",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  /** -----------------------------
   *  Category Pages
   *  ----------------------------- */
  const categoryPaths: MetadataRoute.Sitemap = (CATEGORIES as any[]).map((c) => {
    const seg = encodeURIComponent(String(c.slug ?? c.id ?? ""));
    return {
      url: `${base}/categories/${seg}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  /** -----------------------------
   *  Product Pages
   *  ----------------------------- */
  const productPaths: MetadataRoute.Sitemap = (products as any[]).map((p) => {
    const seg = encodeURIComponent(String(p.slug ?? p.id ?? ""));
    return {
      url: `${base}/products/${seg}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticPaths, ...categoryPaths, ...productPaths];
}
