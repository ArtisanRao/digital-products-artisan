// run with: pnpm dlx tsx scripts/validate-products.ts
import { z } from "zod";

// If your products live in TS (e.g., /data/products.ts), import with tsx:
import { products } from "../data/products"; // adjust path if needed

const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(3),
  price: z.number().positive(),
  shortDescription: z.string().min(30),             // at least ~1 sentence
  longDescription: z.string().min(150),             // ~>150 chars of detail
  features: z.array(z.string().min(3)).min(3),      // ≥3 bullets
  includes: z.array(z.string().min(3)).min(2),      // ≥2 bullets
  license: z.enum(["Personal", "PLR", "MRR"]),
  category: z.string().min(2),
  tags: z.array(z.string().min(2)).min(3),
  seo: z.object({
    metaTitle: z.string().min(10),
    metaDescription: z.string().min(50),
  }),
  images: z.array(z.string()).min(1),
});

const Result = z.array(ProductSchema).safeParse(products);

if (!Result.success) {
  console.error("❌ Product validation failed.\n");
  for (const issue of Result.error.issues) {
    // Each issue has a path like ["3","seo","metaDescription"]
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`✅ ${products.length} products validated successfully.`);
