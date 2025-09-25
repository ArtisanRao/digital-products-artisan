"use client";

import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES } from "@/data/categories";
import { products } from "@/data/products";
import { useState, useMemo } from "react";

/** Optional descriptions (kept from your version) */
const DESC_BY_LABEL: Record<string, string> = {
  "AI & ChatGPT Guides": "Actionable guides, prompts and workflows to build with AI.",
  "Planners & Productivity": "Digital planners, journals and organization systems.",
  "Self-Help & How-To": "Practical guides, routines and step-by-step tutorials.",
  "PLR & MRR Bundles": "Rebrandable products with resale rights (PLR/MRR).",
  "Video Courses & Training": "Structured video lessons and skill accelerators.",
  "Complete Shop Packages": "Ready-made storefront bundles to launch fast.",
  "Health & Fitness eBooks": "Nutrition, training and healthy living guides.",
  "Keto & Diet Guides": "Low-carb & diet frameworks, recipes and tips.",
  "Passive Income & Side Hustles": "Repeatable systems for income outside 9-to-5.",
  "Web Templates": "Website, UI kits and theme starters.",
  "Digital Essentials Hub": "Prompt packs, automations, and utilities.",
  "Social Media Kits": "Post templates and brandable assets for socials.",
  "Fonts & Icons": "Font families and icon sets for brands & apps.",
  "Religious eBooks": "Faith-centered books, devotionals, and study guides.",
};

const GLOBAL_FALLBACKS = [
  "/images/categories/_default/card.jpg",
  "/images/placeholder.jpg",
];

/* ---------------- helpers: category card image with fallbacks ---------------- */

function buildCandidates(slug: string, image?: string): string[] {
  const list: string[] = [];
  if (image) {
    list.push(image);
    if (/\.jpe?g$/i.test(image)) {
      list.push(image.replace(/\.jpe?g$/i, ".png"));
      list.push(image.replace(/\.jpe?g$/i, ".webp"));
    } else if (/\.png$/i.test(image)) {
      list.push(image.replace(/\.png$/i, ".jpg"));
      list.push(image.replace(/\.png$/i, ".webp"));
    } else if (/\.webp$/i.test(image)) {
      list.push(image.replace(/\.webp$/i, ".jpg"));
      list.push(image.replace(/\.webp$/i, ".png"));
    }
  }
  const base = `/images/categories/${slug}/card`;
  list.push(`${base}.jpg`, `${base}.png`, `${base}.webp`);
  list.push(...GLOBAL_FALLBACKS);
  return Array.from(new Set(list));
}

function useCategoryImage(slug: string, image?: string) {
  const candidates = useMemo(() => buildCandidates(slug, image), [slug, image]);
  const [idx, setIdx] = useState(0);
  const src = candidates[idx] ?? GLOBAL_FALLBACKS[0];
  const onError = () => setIdx((i) => (i + 1 < candidates.length ? i + 1 : i));
  return { src, onError };
}

/* ---------------- helpers: product mapping + cover candidates ---------------- */

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function productCategorySlug(p: any): string | null {
  if (p?.categorySlug) return toSlug(String(p.categorySlug));
  if (p?.category) return toSlug(String(p.category));
  return null;
}

function productHrefFor(p: any): string {
  if (p?.slug) return `/products/${p.slug}`;
  if (p?.id != null) return `/products/${p.id}`;
  return "/products";
}

/** Build product preview candidates: cover, listed images, then thumb-1 from folder */
function productCoverCandidates(p: any): string[] {
  const idOrSlug = String(p.slug ?? p.id ?? "");
  const thumb1Base = `/images/products/${idOrSlug}/thumb-1`;
  const fromFolder = [`${thumb1Base}.webp`, `${thumb1Base}.jpg`, `${thumb1Base}.png`];
  const fromList = Array.isArray(p.images) ? p.images : [];
  const cover = p.image ? [p.image] : [];
  const fallbacks = ["/images/placeholder.jpg"];
  return Array.from(new Set([...cover, ...fromList, ...fromFolder, ...fallbacks]));
}

/** Tiny client-side image that steps through candidates on error */
function Thumb({
  href,
  candidates,
  alt,
}: {
  href: string;
  candidates: string[];
  alt: string;
}) {
  const [i, setI] = useState(0);
  const src = candidates[i];
  const onError = () => setI((n) => (n + 1 < candidates.length ? n + 1 : n));
  if (!src) return null;
  return (
    <Link
      href={href}
      className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white opacity-90 transition hover:opacity-100"
      title={alt}
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} onError={onError} alt="" className="h-full w-full object-cover" loading="lazy" />
    </Link>
  );
}

/** Curated reference type: can be object {slug|id} or raw slug/id */
type CurRef = { slug?: string; id?: string | number } | string | number;

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => {
          const { src, onError } = useCategoryImage(c.slug, (c as any).image);
          const desc = DESC_BY_LABEL[c.label] ?? "Explore products in this category.";

          // Curated list first (from data/categories.ts), else fall back to first 3 products in the category
          const curatedRefs: CurRef[] = Array.isArray((c as any).topProducts)
            ? ((c as any).topProducts as CurRef[])
            : [];

          const curatedProducts = curatedRefs
            .map((ref: CurRef) => {
              if (typeof ref === "string" || typeof ref === "number") {
                const key = String(ref);
                return products.find((p: any) => String(p.slug ?? p.id) === key);
              }
              if (ref && typeof ref === "object") {
                if (ref.slug != null) {
                  const key = String(ref.slug);
                  return products.find((p: any) => String(p.slug) === key);
                }
                if (ref.id != null) {
                  const key = String(ref.id);
                  return products.find((p: any) => String(p.id) === key);
                }
              }
              return undefined;
            })
            .filter(Boolean) as any[];

          const fallbackProducts = products.filter(
            (p: any) => productCategorySlug(p) === c.slug
          );

          const previewProducts = (curatedProducts.length ? curatedProducts : fallbackProducts).slice(0, 3);

          return (
            <article
              key={c.slug}
              className="group rounded-2xl border overflow-hidden bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
            >
              <Link href={`/categories/${c.slug}`} aria-label={`Browse ${c.label}`} className="block">
                <div className="relative w-full bg-gray-50">
                  <div className="aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      onError={onError}
                      alt={c.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link
                  href={`/categories/${c.slug}`}
                  className="block hover:underline hover:decoration-2 hover:underline-offset-4"
                >
                  <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600">
                    {c.label}
                  </h2>
                </Link>

                <InlineMore
                  text={desc}
                  lines={2}
                  minChars={1}
                  className="mt-1 text-sm text-gray-600"
                  moreLabel="more"
                  lessLabel="less"
                />

                {/* ---- Product preview strip (curated if present, else first up to 3 in this category) ---- */}
                {previewProducts.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    {previewProducts.map((p: any) => (
                      <Thumb
                        key={String(p.slug ?? p.id)}
                        href={productHrefFor(p)}
                        candidates={productCoverCandidates(p)}
                        alt={`${p.title} preview`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
