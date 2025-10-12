import type { Product } from "@/data/products";

export function buildFallbackDescription(p: Product) {
  const parts: string[] = [];
  parts.push(`${p.title} — a complete digital package crafted for creators and sellers.`);
  if (p.features?.length) parts.push(`**Key features**:\n- ${p.features.join("\n- ")}`);
  if (p.includes?.length) parts.push(`**What’s included**:\n- ${p.includes.join("\n- ")}`);
  parts.push(`**License**: ${p.license}. Use according to the included terms.`);
  return parts.join("\n\n");
}

export function getLongDescription(p: Product) {
  const text = (p.longDescription || "").trim();
  if (text.length >= 120) return text;
  return buildFallbackDescription(p);
}
