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

/* ---------- FS helpers for covers/thumbs ---------- */
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
  const rest = files.filter((f) => !(/^(mock|thumb|preview)[-_]?\d*/i.test(f) || /-mockup/i.test(f)));
  return [...mocks, ...rest].slice(0, 3).map((f) => `/images/products/${slug}/${f}`);
}

/* ---------- Category normalization ---------- */
const normalizeSlug = (s: string) => CATEGORY_SLUG_ALIASES[s] ?? s;

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\be-?books?\b/g, "ebooks")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- Metadata ---------- */
type Params = { slug: string };

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

  const labelSlug = toSlug(meta.label);

  // STRICT matcher: only exact slug/label matches. No substring fuzziness.
  function matchesCategory(p: any): boolean {
    const candText: string[] = [];
    if (typeof p.category === "string") candText.push(p.category);
    if (typeof p.collection === "string") candText.push(p.collection);
    if (typeof p.categorySlug === "string") candText.push(p.categorySlug);
    if (typeof p.category_slug === "string") candText.push(p.category_slug);
    if (Array.isArray(p.categories)) candText.push(...p.categories);
    if (Array.isArray(p.tags)) candText.push(...p.tags);

    const textsLower = candText.map((s) => String(s).trim().toLowerCase());
    const slugs = candText.map((s) => toSlug(String(s)));

    // exact slug match (preferred)
    if (slugs.includes(slug) || slugs.includes(labelSlug)) return true;

    // exact label text match (case-insensitive)
    if (textsLower.includes(meta.label.trim().toLowerCase())) return true;

    return false;
  }

  const catProducts = products.filter(matchesCategory);

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
