// app/categories/[slug]/page.tsx
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

/** Find first existing (absolute + public href) */
function firstExistingPublicHref(cands: (string | undefined)[]): { abs: string; href: string } | null {
  for (const href of cands) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return { abs, href };
  }
  return null;
}

/** Resolve a product cover:
 *  1) p.image
 *  2) /images/products/<slug>/cover.(jpg|png|webp)
 *  3) /images/placeholder.jpg
 */
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

/** Pick up to 3 mockups from /public/images/products/<slug> */
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

/** Helpers to normalize comparisons */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const norm = (s: string) => s.toLowerCase().trim();

/** Static params for new + legacy slugs */
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

/** Robust category matcher: checks label and slug across common product fields */
function productBelongsToCategory(p: any, label: string, slug: string) {
  const labelN = norm(label);
  const slugN = toSlug(slug);
  const labelSlug = toSlug(label);

  const bucket: string[] = [];

  // Strings
  if (p.category) bucket.push(String(p.category));
  if (p.collection) bucket.push(String(p.collection));
  if (p.type) bucket.push(String(p.type));
  if (p.categorySlug) bucket.push(String(p.categorySlug));

  // Arrays
  if (Array.isArray(p.categories)) bucket.push(...p.categories.map(String));
  if (Array.isArray(p.labels)) bucket.push(...p.labels.map(String));
  if (Array.isArray(p.tags)) bucket.push(...p.tags.map(String));

  // Normalize and test
  for (const s of bucket) {
    const sNorm = norm(s);
    const sSlug = toSlug(s);
    if (sNorm === labelN) return true;           // exact label (case-insens)
    if (sSlug === slugN) return true;            // exact slug match
    if (sSlug === labelSlug) return true;        // label → slug match
  }

  // Soft contains (helps if a value is like "Religious eBooks & Devotionals")
  for (const s of bucket) {
    const sNorm = norm(s);
    if (sNorm.includes(labelN)) return true;
  }

  return false;
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  const meta = META[slug];

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

  // ✅ Robust match across product fields
  const matched = products.filter((p: any) => productBelongsToCategory(p, meta.title, slug));

  // Enrich with resolved cover + up to 3 thumbs for the grid
  const items = matched.map((p: any) => ({
    // Make sure AddToCartButton path works when id is numeric
    id: p.id,
    slug: p.slug,
    // Force real product name, not subcategory:
    name: p.title,
    title: p.title,
    description: p.description,
    price: p.price,
    currency: (p.currency as string | undefined) ?? "€",
    image: p.image ?? resolveProductCover(p),
    gallery: p.images?.length ? p.images : resolveProductThumbs(p.slug),
    type: p.type,
    collection: p.collection,
    category: p.category,
    priceId: (p as any).priceId,
    buyUrl: (p as any).buyUrl,
  }));

  return (
    <main className="container mx-auto px-4 py-16">
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
