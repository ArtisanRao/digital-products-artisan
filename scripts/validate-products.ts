// run: pnpm dlx tsx scripts/validate-products.ts
import { z } from "zod";
import { products as rawProducts } from "../data/products";

// Toggle this to true later to *fail* the build on description gaps.
const STRICT = false;

/** ---------- helpers ---------- */
const coerceString = z.preprocess((v) => (v == null ? "" : String(v)), z.string());
const nonEmpty = (min = 1) => z.string().transform((s) => s.trim()).pipe(z.string().min(min));

const ProductSchema = z.object({
  // allow number OR string id, store as string
  id: z.preprocess((v) => String(v ?? ""), z.string().min(1)),
  slug: coerceString.optional(),
  title: nonEmpty(3),
  // keep price as number if provided as number, but allow string too
  price: z.union([z.number().positive(), nonEmpty(1)]),

  // legacy fields
  description: coerceString.optional(),

  // new description system (all optional for now; we’ll warn)
  shortDescription: coerceString.optional(),
  longDescription: coerceString.optional(),
  features: z.array(nonEmpty(1)).optional(),
  includes: z.array(nonEmpty(1)).optional(),
  license: coerceString.optional(),
  category: coerceString.optional(),
  tags: z.array(nonEmpty(1)).optional(),

  images: z.array(nonEmpty(1)).optional(),
  image: coerceString.optional(),

  seo: z
    .object({
      metaTitle: coerceString.optional(),
      metaDescription: coerceString.optional(),
    })
    .optional(),
});

type P = z.infer<typeof ProductSchema>;

const parsed = (rawProducts as any[]).map((p, i) => {
  const r = ProductSchema.safeParse(p);
  if (!r.success) {
    console.error(`❌ Product #${i} failed to parse:`);
    r.error.issues.forEach((iss) =>
      console.error(`  - ${iss.path.join(".")}: ${iss.message}`)
    );
    if (STRICT) process.exit(1);
  }
  return r.success ? r.data : (p as any as P);
});

/** ---------- soft checks: warn, optionally fail on CRITICAL ---------- */
type Gap = { index: number; id: string; slug?: string; title: string; missing: string[] };

const gaps: Gap[] = [];
const criticalGaps: Gap[] = [];

parsed.forEach((p, index) => {
  const missing: string[] = [];

  // CRITICAL: title, price, at least one image source
  const hasImage =
    (Array.isArray(p.images) && p.images.length > 0) || (p.image && p.image.trim().length);
  if (!p.title?.trim()) missing.push("title (CRITICAL)");
  if (!p.price) missing.push("price (CRITICAL)");
  if (!hasImage) missing.push("images/image (CRITICAL)");

  // SOFT (description completeness)
  if (!p.shortDescription?.trim()) missing.push("shortDescription");
  if (!p.longDescription?.trim() && !p.description?.trim()) {
    missing.push("longDescription (or legacy description)");
  }
  if (!p.features || p.features.length < 3) missing.push("features (≥3)");
  if (!p.includes || p.includes.length < 2) missing.push("includes (≥2)");
  if (!p.license?.trim()) missing.push("license");
  if (!p.tags || p.tags.length < 3) missing.push("tags (≥3)");
  if (!p.seo?.metaTitle?.trim()) missing.push("seo.metaTitle");
  if (!p.seo?.metaDescription?.trim()) missing.push("seo.metaDescription");

  if (missing.length) {
    const rec: Gap = {
      index,
      id: String(p.id ?? ""),
      slug: p.slug,
      title: p.title ?? "(untitled)",
      missing,
    };
    gaps.push(rec);
    if (missing.some((m) => m.includes("(CRITICAL)"))) criticalGaps.push(rec);
  }
});

// Print report
if (gaps.length) {
  console.error("❌ Product validation report:\n");
  gaps.forEach((g) => {
    console.error(
      `- #${g.index} ${g.slug ?? g.id ?? ""} "${g.title}": ${g.missing.join(", ")}`
    );
  });
  console.error(
    `\nSummary: ${gaps.length} product(s) need attention (${criticalGaps.length} have CRITICAL gaps).`
  );
}

// Decide exit code
if (STRICT && criticalGaps.length > 0) {
  process.exit(1);
} else {
  // Soft mode passes the build, but still shows the report.
  console.log(
    `✅ Soft validation complete. Set STRICT=true in scripts/validate-products.ts to enforce.`
  );
  process.exit(0);
}
