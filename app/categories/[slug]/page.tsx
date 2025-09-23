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

/** As an absolute path inside /public */
const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

/** Return first existing path (absolute) and its public href */
function firstExistingPublicHref(cands: string[]): { abs: string; href: string } | null {
  for (const href of cands) {
    const abs = pub(href.replace(/^\//, ""));
    if (fs.existsSync(abs)) return { abs, href };
  }
  return null;
}

/** Build category cover (card.*) and thumbs (thumb-*.ext) from /public/images/categories/<slug> */
function readCategoryGallery(slug: string) {
  const dirAbs = pub("images", "categories", slug);
  const coverCands = [
    `/images/categories/${slug}/card.jpg`,
    `/images/categories/${slug}/card.png`,
    `/images/categories/${slug}/card.webp`,
  ];
  const cover = firstExistingPublicHref(coverCands)?.href;

  let thumbs: string[] = [];
  if (fs.existsSync(dirAbs)) {
    const files = fs.readdirSync(dirAbs);
    thumbs = files
      .filter((f) => /^thumb-\d+\.(png|jpe?g|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/categories/${slug}/${f}`);
  }
  return { cover, thumbs };
}

/** Last-resort root-level fallbacks you already keep around */
const ROOT_FALLBACKS_BY_SLUG: Record<string, string[]> = {
  "ai-and-chatgpt-guides":       ["ai-&-chatgpt-guides.jpg", "ai-chatgpt-guides.jpg"],
  "planners-and-productivity":   ["planners-&-productivity.jpg", "planners-productivity.jpg", "planners-productivity.png"],
  "self-help-and-how-to":        ["self-help-&-how-to.jpg", "self-help-how-to.jpg"],
  "plr-and-mrr-bundles":         ["plr-&-mrr-bundles.jpg", "plr-mrr-bundles.jpg"],
  "video-courses-and-training":  ["video-courses-&-training.jpg", "video-courses-training.jpg"],
  "complete-shop-packages":      ["complete-shop-packages.jpg"],
  "health-and-fitness-ebooks":   ["health-&-fitness-ebooks.jpg", "health-fitness-ebooks.jpg"],
  "keto-and-diet-guides":        ["keto-&-diet-guides.jpg", "keto-diet-guides.jpg"],
  "passive-income-and-side-hustles": ["passive-income-&-side-hustles.jpg", "passive-income-side-hustles.jpg"],
  "web-templates":               ["web-templates.jpg", "web-templates1.jpg", "web-templates2.jpg"],
  "digital-essentials-hub":      ["digital-essentials-hub.jpg", "prompt-packs-&-ai-tools.jpg", "prompt-packs-ai-tools.jpg"],
  "social-media-kits":           ["social-media-kits.jpg", "social-media-kits-cover.jpg"],
  "fonts-and-icons":             ["fonts-&-icons.jpg", "fonts.jpg"],
  "religious-ebooks":            ["religious-ebooks.jpg"],
};

const GLOBAL_DEFAULT = "/images/categories/_default/card.jpg";

/** Static params for new and legacy slugs */
export function generateStaticParams() {
  const newSlugs = Object.keys(META);
  const legacySlugs = Object.keys(LEGACY_TO_NEW);
  return [...newSlugs, ...legacySlugs].map((slug) => ({ slug }));
}

type Params = { slug: string };

function normalizeSlug(s: string) {
  return LEGACY_TO_NEW[s] ?? s;
}

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

  // --- Products belonging to this category (match by label/title) ---
  const label = meta.title;
  const catProducts = products.filter((p) => p.category === label);

  // --- Gallery from /images/categories/<slug> ---
  const { cover, thumbs } = readCategoryGallery(slug);

  // --- Strict, curated cover: use card.* if present; else root fallbacks; else global default ---
  const rootFallbacks = (ROOT_FALLBACKS_BY_SLUG[slug] ?? []).map((n) => `/images/${n}`);
  const resolvedRoot = firstExistingPublicHref(rootFallbacks)?.href;
  const coverSrc = cover ?? resolvedRoot ?? GLOBAL_DEFAULT;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.title}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {/* Curated cover */}
      <div className="mt-6 rounded-xl border bg-white p-2">
        <div className="aspect-[16/9] md:aspect-[3/2]">
          <img
            src={coverSrc}
            alt={`${meta.title} cover`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Thumbs gallery from the category folder */}
      {thumbs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">More previews</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {thumbs.map((src) => (
              <div key={src} className="rounded-xl border bg-white hover:shadow-lg transition">
                <img src={src} alt="" className="w-full h-auto object-contain p-2 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products in this category */}
      {catProducts.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catProducts.map((p) => {
              const priceLabel =
                typeof p.price === "number" ? `$${p.price.toFixed(2)}` : (p.price ?? "");
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="rounded-xl border bg-white hover:shadow-lg transition overflow-hidden"
                >
                  <div className="aspect-[3/2] bg-gray-50">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-contain p-3"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <h3 className="font-semibold line-clamp-2">{p.title}</h3>
                    {p.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
                    )}
                    {priceLabel && <div className="mt-2 font-semibold">{priceLabel}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Link href="/products" className="inline-block underline">Browse all products →</Link>
        </div>
      )}
    </main>
  );
}
