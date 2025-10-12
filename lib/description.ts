// lib/description.ts
import type { Product } from "@/types/product";

/**
 * Widen Product locally with optional marketing fields that many of our JSON
 * entries may (or may not) include. This avoids type errors during build while
 * keeping the core Product type unchanged elsewhere.
 */
type ProductWithMarketing = Product & {
  shortDescription?: string;
  features?: string[];
  includes?: string[];
  license?: string;
};

export function buildProductDescription(p: ProductWithMarketing): string {
  const parts: string[] = [];

  // Headline
  parts.push(
    `${p.title} — a complete digital package crafted for creators and sellers.`
  );

  // Short description (if present)
  if (p.shortDescription?.trim()) {
    parts.push(p.shortDescription.trim());
  }

  // Features list
  if (p.features?.length) {
    parts.push(`**Key features**:\n- ${p.features.join("\n- ")}`);
  }

  // What’s included list
  if (p.includes?.length) {
    parts.push(`**What’s included**:\n- ${p.includes.join("\n- ")}`);
  }

  // License (only when provided)
  if (p.license?.trim()) {
    parts.push(`**License**: ${p.license.trim()}. Use according to the included terms.`);
  }

  return parts.join("\n\n");
}
