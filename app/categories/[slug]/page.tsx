import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
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
function firstExistingPublicHref(cands: string[]): { abs: string; href: string } | null {
  for (const href of cands) {
    if (!href) continue;
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return { abs, href };
  }
  return null;
}

/** Resolve a product cover. Prefer product.image; else /images/products/<slug>/cover.(jpg|png|webp) */
function resolveProductCover(p: { slug?: string; image?: string }) {
  const candidates = [
    p.image,
    p.slug ? `/images/products/${p.slug}/cover.jpg` : undefined,
    p.slug ? `/images/products/${p.slug}/cover.png` : undefined,
    p.slug ? `/images/products/${p.slug}/cover.webp` : undefined,
  ].filter(Boolean) as string[];
  return firstExistingPublicHref(candidates)?.href ?? "/images/placeholder.jpg";
}

/** Static params for new and legacy slugs */
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

  // Products in this category (match by label/title)
  const label = meta.title;
  const catProducts = products.filter((p) => p.category === label);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.title}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {catProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {catProducts.map((p) => {
            const img = resolveProductCover(p);
            const priceLabel =
              typeof p.price === "number" ? `${p.price.toFixed(2)} €` : (p.price ?? "");
            const addHref = (p as any).addToCartUrl ?? `/products/${p.slug}?add=1`;
            const buyHref = (p as any).buyUrl ?? `/products/${p.slug}#buy`;

            return (
              <article key={p.slug} className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition">
                <Link href={`/products/${p.slug}`} className="block">
                  <div className="aspect-[3/2] bg-gray-50 rounded-xl overflow-hidden">
                    <img src={img} alt={p.title} className="h-full w-full object-contain p-3" loading="lazy" />
                  </div>
                </Link>

                <h3 className="mt-3 text-xl font-semibold">
                  <Link href={`/products/${p.slug}`} className="hover:underline">{p.title}</Link>
                </h3>

                {p.description && (
                  <p className="mt-1 text-gray-600 line-clamp-2">{p.description}</p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-2xl font-semibold">{priceLabel}</div>
                  {/* Optional rating if you have p.rating / p.reviews */}
                  {(p as any).rating && (
                    <div className="text-sm text-gray-500">⭐ {(p as any).rating} ({(p as any).reviews ?? 0})</div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <Link href={`/products/${p.slug}`} className="rounded-xl border px-4 py-2 text-sm hover:bg-muted/30">
                    👁️ View
                  </Link>
                  <Link href={addHref} prefetch={false} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    🛒 Add to cart
                  </Link>
                  {/* Show Buy if you wire a direct checkout URL */}
                  {(p as any).buyUrl && (
                    <Link href={buyHref} prefetch={false} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                      ⚡ Buy
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
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
