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
function fixTypos(s: string) {
  return s.replace(/\breligous\b/gi, "religious");
}
function normName(s: string) {
  return fixTypos(
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
function normSlug(s: string) {
  return fixTypos(
    s
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/\be[\s-]?books?\b/g, "ebooks")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
function tokensOfLabel(label: string) {
  const STOP = new Set(["and", "the", "in", "of", "for", "to", "a", "an"]);
  return normName(label)
    .split(" ")
    .filter((t) => t && !STOP.has(t));
}

/* ---------- Static params ---------- */
export function generateStaticParams() {
  const slugs = Object.keys(CATEGORY_BY_SLUG);
  const legacy = Object.keys(CATEGORY_SLUG_ALIASES);
  return [...slugs, ...legacy].map((slug) => ({ slug }));
}
type Params = { slug: string };
const alias = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

/* ---------- Metadata ---------- */
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug: raw } = await params;
  const slug = alias(raw);
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
  const slug = alias(raw);
  const meta = CATEGORY_BY_SLUG[slug];

  if (!meta) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16" data-cat-build="strict-v4">
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

  const wantedSlug = normSlug(slug);
  const labelTokens = tokensOfLabel(meta.label); // e.g. ["religious","ebooks"]

  // 1) STRICT: categorySlug exact OR category/categories name-equality
  const strictMatch = (p: any) => {
    if (typeof p.categorySlug === "string") {
      return normSlug(p.categorySlug) === wantedSlug;
    }
    const cands: string[] = [];
    if (typeof p.category === "string") cands.push(p.category);
    if (Array.isArray(p.categories)) cands.push(...p.categories);
    const normalized = cands.map(normName);
    const wantedName = normName(meta.label);
    return normalized.some((n) => n === wantedName);
  };

  let catProducts = products.filter(strictMatch);

  // 2) FALLBACK (only if strict found nothing): allow tags/collection,
  // but REQUIRE every token from the category label to appear.
  if (catProducts.length === 0) {
    const relaxedMatch = (p: any) => {
      const hay = normName(
        `${p.category ?? ""} ${Array.isArray(p.categories) ? p.categories.join(" ") : ""} ${
          Array.isArray(p.tags) ? p.tags.join(" ") : ""
        } ${p.collection ?? ""} ${p.categorySlug ?? ""}`
      );
      return labelTokens.every((t) => hay.includes(t));
    };
    catProducts = products.filter(relaxedMatch);
  }

  const items = catProducts.map((p: any) => ({
    ...p,
    image: p.image ?? resolveProductCover(p),
    gallery: Array.isArray(p.images) && p.images.length ? p.images : resolveProductThumbs(p.slug),
  }));

  return (
    <main className="container mx-auto px-4 py-16" data-cat-build="strict-v4">
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
