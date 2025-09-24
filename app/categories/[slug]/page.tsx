// app/categories/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import CategoryProductGrid from "@/components/categories/CategoryProductGrid";
import { products } from "@/data/products";
import { CATEGORY_BY_SLUG, CATEGORY_SLUG_ALIASES } from "@/data/categories";

/* ---------- FS helpers ---------- */
const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);
function firstExistingPublicHref(cands: (string | undefined)[]) {
  for (const href of cands) {
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
  const mocks = files.filter(
    (f) => /^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f)
  );
  const rest = files.filter(
    (f) => !(/^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f))
  );
  return [...mocks, ...rest].slice(0, 3).map((f) => `/images/products/${slug}/${f}`);
}

/* ---------- Normalization ---------- */
function normalizeTypos(s: string) {
  return s.replace(/\breligous\b/gi, "religious");
}
function norm(s: string) {
  return normalizeTypos(
    s
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/\be[\s-]?books?\b/g, "ebooks")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
function altForms(label: string, slug?: string) {
  const set = new Set<string>();
  const add = (x: string) => set.add(norm(x));
  add(label);
  add(label.replace(/&/g, "and"));
  add(label.replace(/\band\b/gi, "&"));
  add(label.replace(/\be[\s-]?books?\b/gi, "ebooks"));
  // singular variant
  add(label.replace(/\bebooks\b/i, "ebook"));
  if (slug) {
    const slugSpaced = slug.replace(/-/g, " ");
    add(slugSpaced);
    add(slugSpaced.replace(/&/g, "and"));
  }
  return set;
}

/* ---------- Static params ---------- */
export function generateStaticParams() {
  const slugs = Object.keys(CATEGORY_BY_SLUG);
  const legacy = Object.keys(CATEGORY_SLUG_ALIASES);
  return [...slugs, ...legacy].map((slug) => ({ slug }));
}
type Params = { slug: string };
const normalizeSlug = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

/* ---------- Metadata ---------- */
export async function generateMetadata({ params }: { params: Promise<Params> }) {
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

/* ---------- Page ---------- */
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
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

  // STRICT: Only match against category/categorySlug/categories[]
  const wanted = altForms(meta.label, slug);
  const isInCategory = (p: any) => {
    const bucket: string[] = [];
    if (typeof p.category === "string") bucket.push(p.category);
    if (Array.isArray(p.categories)) bucket.push(...p.categories);
    if (typeof p.categorySlug === "string") bucket.push(p.categorySlug.replace(/-/g, " "));

    const normalized = bucket.map((s) => norm(String(s)));
    // exact set intersection only (no substrings)
    return normalized.some((n) => wanted.has(n));
  };

  let catProducts = products.filter(isInCategory);

  // Soft fallback ONLY if empty: tolerate tiny spelling drift inside category fields
  if (catProducts.length === 0) {
    const wantedList = Array.from(wanted);
    catProducts = products.filter((p: any) => {
      const bucket: string[] = [];
      if (typeof p.category === "string") bucket.push(p.category);
      if (Array.isArray(p.categories)) bucket.push(...p.categories);
      if (typeof p.categorySlug === "string") bucket.push(p.categorySlug.replace(/-/g, " "));
      const hay = norm(bucket.join(" "));
      return wantedList.some((w) => hay.includes(w));
    });
  }

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
