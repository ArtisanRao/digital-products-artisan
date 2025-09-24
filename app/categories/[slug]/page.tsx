// app/categories/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import CategoryProductGrid from "@/components/categories/CategoryProductGrid";
import { products } from "@/data/products";
import { CATEGORY_BY_SLUG, CATEGORY_SLUG_ALIASES } from "@/data/categories";

/* ---------------- FS helpers for covers/thumbs ---------------- */
const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

function firstExistingPublicHref(hrefs: (string | undefined)[]): string | undefined {
  for (const href of hrefs) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return href;
  }
  return undefined;
}

function resolveProductCover(p: { slug?: string; image?: string }) {
  const fallback = "/images/placeholder.jpg";
  if (!p?.slug) return p?.image ?? fallback;
  return (
    firstExistingPublicHref([
      p.image,
      `/images/products/${p.slug}/cover.jpg`,
      `/images/products/${p.slug}/cover.png`,
      `/images/products/${p.slug}/cover.webp`,
    ]) ?? fallback
  );
}

function resolveProductThumbs(slug?: string) {
  if (!slug) return [] as string[];
  const dir = pub("images", "products", slug);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const mocks = files.filter((f) => /^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f));
  const rest  = files.filter((f) => !(/^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f)));
  return [...mocks, ...rest].slice(0, 3).map((f) => `/images/products/${slug}/${f}`);
}

/* ---------------- Category normalization & maps ---------------- */
const norm = (s: string) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\breligous\b/g, "religious")      // common typo
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SLUGS = Object.keys(CATEGORY_BY_SLUG);
const LABEL_NORM_TO_SLUG = new Map<string, string>(
  SLUGS.map((slug) => [norm(CATEGORY_BY_SLUG[slug].label), slug]),
);

const normalizeSlug = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

/* Very-light keyword fallback for obvious cases only */
const KEYWORD_RULES: Array<{ re: RegExp; slug: string }> = [
  { re: /\b(religious|religion|bible|qur'?an|quran|islam|christ|church|devotional|prayer|faith|exorcist)\b/i, slug: "religious-ebooks" },
  { re: /\b(chatgpt|gpt|prompt|ai)\b/i, slug: "ai-and-chatgpt-guides" },
  { re: /\b(font|typeface|icon set|icons?)\b/i, slug: "fonts-and-icons" },
  { re: /\b(plr|mrr|resell rights|private label rights|master resell)\b/i, slug: "plr-and-mrr-bundles" },
  { re: /\b(template|theme|website|landing page|ui kit)\b/i, slug: "web-templates" },
  { re: /\b(course|training|masterclass|bootcamp|video lessons?)\b/i, slug: "video-courses-and-training" },
  // ✅ map Keto correctly to the Keto category
  { re: /\b(keto|diet|meal plan|weight loss)\b/i, slug: "keto-and-diet-guides" },
  { re: /\b(nutrition|fitness|workout|wellness)\b/i, slug: "health-and-fitness-ebooks" },
  { re: /\b(planner|journal|habit tracker|productivity)\b/i, slug: "planners-and-productivity" },
  { re: /\b(social media|instagram|facebook|tiktok|pinterest|canva)\b/i, slug: "social-media-kits" },
  { re: /\b(complete shop|store package|storefront)\b/i, slug: "complete-shop-packages" },
];

/** Infer ONE canonical category slug for a product */
function inferCategorySlug(p: any): string | null {
  // 1) Explicit slug on the product (wins)
  const explicitSlug: string | undefined =
    p.categorySlug || p.slugCategory || p.primaryCategorySlug;
  if (explicitSlug) {
    const s = normalizeSlug(String(explicitSlug));
    return SLUGS.includes(s) ? s : null;
  }

  // 2) Fields that might carry labels or slugs
  const cands: string[] = [];
  if (typeof p.category === "string") cands.push(p.category);
  if (Array.isArray(p.categories)) cands.push(...p.categories);
  if (Array.isArray(p.tags)) cands.push(...p.tags);
  if (typeof p.collection === "string") cands.push(p.collection);

  // slug match first
  for (const raw of cands) {
    const s = normalizeSlug(String(raw));
    if (SLUGS.includes(s)) return s;
  }
  // label match (normalized) → slug
  for (const raw of cands) {
    const n = norm(String(raw));
    const found = LABEL_NORM_TO_SLUG.get(n);
    if (found) return found;
  }

  // 3) Light keyword fallback (title/name/label/description)
  const hay = `${p.title ?? ""} ${p.name ?? ""} ${p.label ?? ""} ${p.description ?? ""}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(hay)) return rule.slug;
  }

  return null;
}

/* ---------------- Static params ---------------- */
export function generateStaticParams() {
  const slugs = Object.keys(CATEGORY_BY_SLUG);
  const legacy = Object.keys(CATEGORY_SLUG_ALIASES);
  return [...slugs, ...legacy].map((slug) => ({ slug }));
}

/* ---------------- Metadata ---------------- */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  const meta = CATEGORY_BY_SLUG[slug];
  const title = meta ? `${meta.label} | Digital Products Artisan` : "Digital Products | Digital Products Artisan";
  const description = meta?.description ?? "Browse our curated digital products.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------------- Page ---------------- */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  const meta = CATEGORY_BY_SLUG[slug];

  if (!meta) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{pretty}</h1>
        <InlineMore
          text="We couldn’t find a dedicated page for this category yet. Explore best sellers below or visit all products."
          lines={1}
          minChars={40}
          className="text-gray-700"
        />
        <p className="mt-2">
          <Link href="/products" className="underline">Browse all products →</Link>
        </p>
      </main>
    );
  }

  // ✅ Primary: match by canonical product.category LABEL (prevents cross-listing)
  const want = norm(meta.label);
  let catProducts = products.filter((p: any) => norm(p.category) === want);

  // ↩️ Fallback only if empty: use inferred slug (helps when some items lack labels)
  if (catProducts.length === 0) {
    catProducts = products.filter((p: any) => inferCategorySlug(p) === slug);
  }

  // Enrich for grid
  const items = catProducts.map((p: any) => ({
    ...p,
    image: p.image ?? resolveProductCover(p),
    gallery: Array.isArray(p.images) && p.images.length ? p.images : resolveProductThumbs(p.slug),
  }));

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.label}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {items.length ? (
        <div className="mt-6">
          <CategoryProductGrid items={items} />
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-gray-700">No products listed in this category yet.</p>
          <Link href="/products" className="mt-2 inline-block underline">Browse all products →</Link>
        </div>
      )}
    </main>
  );
}
