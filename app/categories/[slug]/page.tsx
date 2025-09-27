// app/categories/[slug]/page.tsx
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Script from "next/script";
import InlineMore from "@/components/ui/inline-more";
import { products } from "@/data/products";
import ProductCardV4 from "../../../components/shop/ProductCardV4";

// ── Force fresh SSR + Node runtime (we use fs) ───────────────────────────────
export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const UI_VERSION = "cat-v12-cover+3extras-prefers-product.images";

// ---- Category metadata (normalized slugs) ----
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

// Backward-compat slug aliases (old → new)
const LEGACY_TO_NEW: Record<string, string> = {
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",
};

const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);

// ----------------------- exact fixes -----------------------
const tnorm = (s: string) => s.toLowerCase().trim();

const FIX_BY_TITLE: Record<string, { forceSlug?: string; hide?: boolean }> = {
  [tnorm("Video Courses And Training")]: { forceSlug: "video-courses-and-training" },
  [tnorm("Self Help And How To")]: { hide: true },
  [tnorm("Complete Shop Packages")]: { hide: true },
  [tnorm("Passive Income And Side Hustles")]: { hide: true },
  [tnorm("The Art Of Giving No Fucks")]: { forceSlug: "self-help-and-how-to" },
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALL_SLUGS = new Set(Object.keys(META));
const LABEL_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(META).map(([slug, m]) => [m.title.toLowerCase(), slug])
);

function effectiveProductCategorySlug(p: any): string | null {
  const titleKey = tnorm(String(p.title ?? ""));
  const fix = FIX_BY_TITLE[titleKey];
  if (fix?.hide) return "__HIDE__";
  if (fix?.forceSlug) return fix.forceSlug;

  if (p.categorySlug) {
    const s = toSlug(String(p.categorySlug));
    const normalized = LEGACY_TO_NEW[s] ?? s;
    return ALL_SLUGS.has(normalized) ? normalized : null;
  }
  if (p.category) {
    const fromLabel = LABEL_TO_SLUG[String(p.category).toLowerCase()];
    if (fromLabel) return fromLabel;
    const guess = toSlug(String(p.category));
    const normalized = LEGACY_TO_NEW[guess] ?? guess;
    return ALL_SLUGS.has(normalized) ? normalized : null;
  }
  return null;
}

// Read up to N thumbs from /public/images/products/<slug>/thumb-*.ext (numeric sort)
function readProductThumbs(slug?: string, max = 3): string[] {
  if (!slug) return [];
  const dir = pub("images", "products", slug);
  if (!fs.existsSync(dir)) return [];
  const names = fs
    .readdirSync(dir)
    .filter((f) => /^thumb-\d+\.(png|jpe?g|webp|avif)$/i.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/\d+/)?.[0] ?? 0);
      const nb = Number(b.match(/\d+/)?.[0] ?? 0);
      return na - nb;
    })
    .slice(0, max);
  return names.map((n) => `/images/products/${slug}/${n}`);
}

// Build images for the card: cover + up to 3 extras.
// Prefer product.images (so cards match product page), then fallback to filesystem thumbs.
function buildCardImages(p: any): string[] {
  const productImages = Array.isArray(p.images) ? (p.images as string[]) : [];
  const cover = (productImages[0] ?? p.image ?? "/images/placeholder.jpg") as string;

  const extrasFromProduct = productImages.slice(1).filter(Boolean);
  const extrasFromFS = readProductThumbs(p.slug, 3);

  const extras = Array.from(new Set([...extrasFromProduct, ...extrasFromFS]))
    .filter((src) => src && src !== cover)
    .slice(0, 3);

  const images = [cover, ...extras];
  return images;
}

// Static params for new and legacy slugs (harmless even with force-dynamic)
export function generateStaticParams() {
  const newSlugs = Object.keys(META);
  const legacySlugs = Object.keys(LEGACY_TO_NEW);
  return [...newSlugs, ...legacySlugs].map((slug) => ({ slug }));
}

const normalizeSlug = (s: string) => LEGACY_TO_NEW[s] ?? s;

// ✅ Use `any` for props to avoid Next’s PageProps constraint (some templates expect Promise)
export async function generateMetadata(props: any) {
  const raw = String(props?.params?.slug ?? "");
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

// ✅ Same trick here: props as `any`, then safely read params.slug
export default async function CategoryPage(props: any) {
  const raw = String(props?.params?.slug ?? "");
  const slug = normalizeSlug(raw);
  const meta = META[slug];

  if (!meta) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16" data-ui={`CategoryPage@${UI_VERSION}:not-found`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{pretty}</h1>
        <InlineMore
          text="We couldn’t find a dedicated page for this category yet. Explore best sellers below or visit all products."
          lines={1}
          minChars={40}
          className="text-gray-700"
        />
        <p className="mt-2">
          <Link href="/products" className="underline" prefetch={false}>Browse all products →</Link>
        </p>
      </main>
    );
  }

  // Filter by effective slug and exclude “hidden” products
  const catProducts = products.filter((p) => {
    const eff = effectiveProductCategorySlug(p);
    return eff !== "__HIDE__" && eff === slug;
  });

  // Card data: 1 cover + up to 3 extras (deduped) with cache-buster
  const cards = catProducts.map((p) => {
    const imagesRaw = buildCardImages(p);
    const deduped = Array.from(new Set(imagesRaw)) as string[];
    const images = deduped.map((src) =>
      src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`
    );

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      images, // cover first, then up to 3 extras
      description: p.description,
    };
  });

  return (
    <main className="container mx-auto px-4 py-12" data-ui={`CategoryPage@${UI_VERSION}`}>
      {/* One-time kill of any old SW/cache that may be serving stale bundles */}
      <Script id="sw-reset-cat" strategy="afterInteractive">
        {`(async()=>{try{
          if('serviceWorker' in navigator){
            const regs = await navigator.serviceWorker.getRegistrations();
            for(const r of regs){ try{await r.unregister();}catch(_){} }
          }
          if('caches' in window){
            const keys = await caches.keys();
            for(const k of keys){ if(/^(workbox|next-pwa|static-|pages-cache-)/.test(k)) { try{await caches.delete(k);}catch(_){} } }
          }
        }catch(e){console.warn('SW reset failed', e);} })();`}
      </Script>

      <h1 className="text-3xl md:text-4xl font-bold">{meta.title}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="mt-1 text-gray-700" />

      {cards.length ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-ui={`category-grid@${UI_VERSION}`}>
          {cards.map((c) => (
            <ProductCardV4 key={`${UI_VERSION}:${String(c.slug ?? c.id)}`} {...c} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-gray-600">No products in this category yet.</p>
          <Link href="/products" prefetch={false} className="mt-3 inline-block underline">
            Browse all products →
          </Link>
        </div>
      )}
    </main>
  );
}
