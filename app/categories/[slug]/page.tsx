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

/** First existing (absolute + public href) */
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
    .sort();
  return files.slice(0, 3).map((f) => `/images/products/${slug}/${f}`);
}

/* ---------------- Robust category matching helpers ---------------- */
const SEP = /[\/|,;›»:\-\u2013\u2014]+/; // slash, pipe, comma, semicolon, chevrons, colon, dashes

function norm(x?: string) {
  return String(x ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenized(x?: string) {
  return String(x ?? "")
    .split(SEP)
    .map((s) => norm(s))
    .filter(Boolean);
}

function matchesCategory(prod: any, slug: string, label: string) {
  const want = norm(label);
  const wantSlug = slug;

  // Direct slug fields if present
  const catSlug = norm((prod as any).categorySlug);
  const catSlugs: string[] = Array.isArray((prod as any).categorySlugs)
    ? (prod as any).categorySlugs.map((s: string) => norm(s))
    : [];

  if (catSlug === wantSlug || catSlugs.includes(wantSlug)) return true;

  // Single string category
  const c = norm((prod as any).category);
  if (c) {
    if (c === want) return true;
    if (c.startsWith(want)) return true;
    if (c.includes(want)) return true;
    const parts = tokenized((prod as any).category);
    if (parts.includes(want)) return true;
  }

  // Array of categories
  const cs: string[] = Array.isArray((prod as any).categories)
    ? (prod as any).categories
    : [];
  if (cs.length) {
    const any = cs.some((t) => {
      const tn = norm(t);
      return (
        tn === want ||
        tn.startsWith(want) ||
        tn.includes(want) ||
        tokenized(t).includes(want)
      );
    });
    if (any) return true;
  }

  return false;
}

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

  // ✅ Robust product selection for this category (covers subcategories & arrays)
  const catProducts = products.filter((p) => matchesCategory(p, slug, meta.title));

  // Enrich with resolved cover + up to 3 thumbs (used by CategoryProductGrid)
  const items = catProducts.map((p: any) => ({
    ...p,
    // Make sure the grid shows the real product name (never the subcategory label)
    title: p.title ?? p.name ?? p.label ?? String(p.slug ?? p.id ?? "Untitled"),
    image: p.image ?? resolveProductCover(p),
    gallery: p.gallery && p.gallery.length ? p.gallery : resolveProductThumbs(p.slug),
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
          <p className="text-gray-700">
            No products found for this category yet.
          </p>
          <Link href="/products" className="mt-2 inline-block underline">
            Browse all products →
          </Link>
        </div>
      )}
    </main>
  );
}
