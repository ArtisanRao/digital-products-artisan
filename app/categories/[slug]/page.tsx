// app/categories/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import CategoryProductGrid from "@/components/categories/CategoryProductGrid";
import { products } from "@/data/products";

/** ---- Category metadata (normalized slugs) ---- */
const META: Record<string, { title: string; description: string }> = {
  "ai-and-chatgpt-guides":       { title: "AI & ChatGPT Guides",     description: "Guides, prompts and AI learning resources." },
  "planners-and-productivity":   { title: "Planners & Productivity", description: "Digital planners, journals and productivity tools." },
  "self-help-and-how-to":        { title: "Self-Help & How-To",      description: "Practical how-to guides and self-improvement." },
  "plr-and-mrr-bundles":         { title: "PLR & MRR Bundles",       description: "Done-for-you PLR/MRR products and kits." },
  "video-courses-and-training":  { title: "Video Courses & Training",description: "Structured video lessons and trainings." },
  "complete-shop-packages":      { title: "Complete Shop Packages",  description: "Turn-key storefront bundles and assets." },
  "health-and-fitness-ebooks":   { title: "Health & Fitness eBooks", description: "Nutrition, fitness and wellness books." },
  "keto-and-diet-guides":        { title: "Keto & Diet Guides",      description: "Keto and nutrition programs and meal plans." },
  "passive-income-and-side-hustles": { title: "Passive Income & Side Hustles", description: "Monetization playbooks and templates." },
  "web-templates":               { title: "Web Templates",           description: "Website templates, UI kits and themes." },
  "digital-essentials-hub":      { title: "Digital Essentials Hub",  description: "Prompt packs, automations, and utilities." },
  "fonts-and-icons":             { title: "Fonts & Icons",           description: "Font families and icon sets." },
  "religious-ebooks":            { title: "Religious eBooks",        description: "Faith-centered books, devotionals and study guides." },
  "social-media-kits":           { title: "Social Media Kits",       description: "Post templates and brandable assets for socials." },
};

/** Backward-compat slug aliases (old → new) */
const LEGACY_TO_NEW: Record<string, string> = {
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",
};

const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

/** File helpers */
function firstExistingPublicHref(cands: (string | undefined)[]): { abs: string; href: string } | null {
  for (const href of cands) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return { abs, href };
  }
  return null;
}
function resolveProductCover(p: { slug?: string; image?: string }) {
  const fallback = "/images/placeholder.jpg";
  if (!p.slug) return p.image ?? fallback;
  return (
    firstExistingPublicHref([
      p.image,
      `/images/products/${p.slug}/cover.jpg`,
      `/images/products/${p.slug}/cover.png`,
      `/images/products/${p.slug}/cover.webp`,
    ])?.href ?? fallback
  );
}
function resolveProductThumbs(slug?: string) {
  if (!slug) return [] as string[];
  const dir = pub("images", "products", slug);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .filter((f) => /^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return files.slice(0, 3).map((f) => `/images/products/${slug}/${f}`);
}

/** Normalizers */
const norm = (s: string) => s.toLowerCase().trim();
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const STOP = new Set([
  "and","the","of","a","an","to","for","in","on","with",
  "ebook","ebooks","book","books","e-book","e-books",
  "template","templates","bundle","bundles","digital","kit","kits"
]);
const tokenize = (s: string) => toSlug(s).split("-").filter(t => t && !STOP.has(t));

/** Aliases (helps religious/faith matching too) */
const CATEGORY_ALIASES: Record<string,string[]> = {
  "religious-ebooks": ["religious","religion","faith","christian","christianity","devotional","devotionals","bible","scripture","spiritual","spirituality"],
};

/** Static params */
export function generateStaticParams() {
  const newSlugs = Object.keys(META);
  const legacySlugs = Object.keys(LEGACY_TO_NEW);
  return [...newSlugs, ...legacySlugs].map((slug) => ({ slug }));
}

type Params = { slug: string };
const normalizeSlug = (s: string) => LEGACY_TO_NEW[s] ?? s;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  const m = META[slug];
  const title = m ? `${m.title} | Digital Products Artisan` : "Digital Products | Digital Products Artisan";
  const description = m?.description ?? "Browse our curated digital products.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** STRICT direct checks first, then soft token checks */
function productBelongsToCategory(p: any, catLabel: string, catSlug: string) {
  const labelN = norm(catLabel);
  const labelSlug = toSlug(catLabel);
  const slugN = toSlug(catSlug);

  // Candidate single-value fields
  const singles = [p.category, p.categorySlug, p.collection, p.type, p.section, p.genre];
  for (const s of singles) {
    if (!s) continue;
    const sN = norm(String(s));
    const sSlug = toSlug(String(s));
    if (sN === labelN || sSlug === slugN || sSlug === labelSlug) return true;
  }

  // Arrays
  const arrays = [p.categories, p.labels, p.tags];
  for (const arr of arrays) {
    if (!Array.isArray(arr)) continue;
    for (const s of arr) {
      const sN = norm(String(s));
      const sSlug = toSlug(String(s));
      if (sN === labelN || sSlug === slugN || sSlug === labelSlug) return true;
    }
  }

  // Soft: token overlap
  const labelTokens = new Set([
    ...tokenize(catLabel),
    ...tokenize(catSlug),
    ...(CATEGORY_ALIASES[slugN] ?? []),
  ]);
  const bucket: string[] = [];
  for (const s of singles) if (s) bucket.push(String(s));
  for (const arr of arrays) if (Array.isArray(arr)) bucket.push(...arr.map(String));
  if (bucket.some(s => tokenize(s).some(t => labelTokens.has(t)))) return true;

  return false;
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  const meta = META[slug];

  if (!meta) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16" data-catgrid="v3">
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

  // Use strict direct match first (this mirrors what used to work), then token fallback
  const matched = products.filter((p: any) => productBelongsToCategory(p, meta.title, slug));

  // Build items for the grid — always use real product name
  const items = matched.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.title,                 // ✅ ensure product title, not subcategory label
    title: p.title,
    description: p.description,
    price: p.price,
    currency: p.currency ?? "€",
    image: p.image ?? resolveProductCover(p),
    gallery: Array.isArray(p.images) && p.images.length ? p.images : resolveProductThumbs(p.slug),
    type: p.type,
    collection: p.collection,
    category: p.category,
    priceId: p.priceId,
    buyUrl: p.buyUrl,
  }));

  return (
    <main className="container mx-auto px-4 py-16" data-catgrid="v3">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.title}</h1>
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
