// app/api/debug/category-audit/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { CATEGORY_BY_SLUG, CATEGORY_SLUG_ALIASES } from "@/data/categories";

const KNOWN_SLUGS = Object.keys(CATEGORY_BY_SLUG);

const norm = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\breligous\b/g, "religious") // common typo
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const LABEL_TO_SLUG = new Map<string, string>(
  KNOWN_SLUGS.map((slug) => [norm(CATEGORY_BY_SLUG[slug].label), slug]),
);

const normalizeSlug = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

// very light, obvious keyword rules (only used if no explicit label/slug found)
const KEYWORD_RULES: Array<{ re: RegExp; slug: string }> = [
  { re: /\b(religious|religion|bible|qur'?an|islam|christ|church|devotional|prayer|faith)\b/i, slug: "religious-ebooks" },
  { re: /\b(chatgpt|gpt|prompt|ai)\b/i, slug: "ai-and-chatgpt-guides" },
  { re: /\b(font|typeface|icon set|icons?)\b/i, slug: "fonts-and-icons" },
  { re: /\b(plr|mrr|resell rights|private label rights|master resell)\b/i, slug: "plr-and-mrr-bundles" },
  { re: /\b(template|theme|website|landing page|ui kit)\b/i, slug: "web-templates" },
  { re: /\b(course|training|masterclass|bootcamp|video lessons?)\b/i, slug: "video-courses-and-training" },
  { re: /\b(keto|diet|meal plan|weight loss|nutrition|fitness|workout)\b/i, slug: "health-and-fitness-ebooks" },
  { re: /\b(planner|journal|habit tracker|productivity)\b/i, slug: "planners-and-productivity" },
  { re: /\b(social media|instagram|facebook|tiktok|pinterest|canva)\b/i, slug: "social-media-kits" },
  { re: /\b(complete shop|store package|storefront)\b/i, slug: "complete-shop-packages" },
];

function existingSlugFromFields(p: any): string | null {
  // explicit slug field(s)
  const explicit = p.categorySlug || p.slugCategory || p.primaryCategorySlug;
  if (explicit) {
    const s = normalizeSlug(String(explicit));
    return KNOWN_SLUGS.includes(s) ? s : null;
  }

  // label-ish fields that might equal a slug or a visible label
  const cands: string[] = [];
  if (typeof p.category === "string") cands.push(p.category);
  if (Array.isArray(p.categories)) cands.push(...p.categories);
  if (Array.isArray(p.tags)) cands.push(...p.tags);
  if (typeof p.collection === "string") cands.push(p.collection);

  // try slug
  for (const raw of cands) {
    const s = normalizeSlug(String(raw));
    if (KNOWN_SLUGS.includes(s)) return s;
  }
  // try label
  for (const raw of cands) {
    const n = norm(String(raw));
    const found = LABEL_TO_SLUG.get(n);
    if (found) return found;
  }
  return null;
}

function inferCategorySlug(p: any): string | null {
  const fromFields = existingSlugFromFields(p);
  if (fromFields) return fromFields;

  // light keyword inference from title/desc when fields are missing/ambiguous
  const hay = `${p.title ?? ""} ${p.name ?? ""} ${p.label ?? ""} ${p.description ?? ""}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(hay)) return rule.slug;
  }
  return null;
}

export async function GET() {
  const rows = products.map((p: any) => {
    const id = p.id ?? p.slug ?? p.title ?? "(no id)";
    const title = p.title ?? p.name ?? p.label ?? "(untitled)";

    const fieldSlug = existingSlugFromFields(p);     // what product currently claims
    const inferred  = inferCategorySlug(p);          // what our logic assigns
    const fieldLabel = fieldSlug ? CATEGORY_BY_SLUG[fieldSlug]?.label : null;
    const inferredLabel = inferred ? CATEGORY_BY_SLUG[inferred]?.label : null;

    const mismatch =
      Boolean(fieldSlug && inferred && fieldSlug !== inferred);

    return {
      id,
      slug: p.slug ?? null,
      title,
      fieldSlug,
      fieldLabel,
      inferredSlug: inferred,
      inferredLabel,
      sources: {
        category: p.category ?? null,
        categories: Array.isArray(p.categories) ? p.categories : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
        collection: p.collection ?? null,
      },
      mismatch,
      unknown: inferred === null,
    };
  });

  const mismatched = rows.filter((r) => r.mismatch);
  const unknown    = rows.filter((r) => r.unknown);
  const matched    = rows.filter((r) => !r.mismatch && !r.unknown);

  return NextResponse.json({
    total: rows.length,
    matched: matched.length,
    mismatched: mismatched.length,
    unknown: unknown.length,
    rows,
  });
}
