// lib/description.ts
import type { Product } from "@/types/product";

/** Extend Product with optional marketing fields used by some entries */
type ProductWithMarketing = Product & {
  shortDescription?: string;
  features?: string[];
  includes?: string[];
  license?: string;
};

/** Primary builder used across the app */
export function buildProductDescription(p: ProductWithMarketing): string {
  const parts: string[] = [];

  parts.push(`${p.title} — a complete digital package crafted for creators and sellers.`);

  if (p.shortDescription?.trim()) {
    parts.push(p.shortDescription.trim());
  }

  if (p.features?.length) {
    parts.push(`**Key features**:\n- ${p.features.join("\n- ")}`);
  }

  if (p.includes?.length) {
    parts.push(`**What’s included**:\n- ${p.includes.join("\n- ")}`);
  }

  if (p.license?.trim()) {
    parts.push(`**License**: ${p.license.trim()}. Use according to the included terms.`);
  }

  return parts.join("\n\n");
}

/** Back-compat alias for callers importing getLongDescription */
export function getLongDescription(p: ProductWithMarketing): string {
  return buildProductDescription(p);
}
