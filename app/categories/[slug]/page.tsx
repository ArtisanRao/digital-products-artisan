import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import ProductCardV4 from "@/components/shop/ProductCardV4";

// Central data
import { products, productsInCategory, CATEGORY_LABELS } from "@/data/products";

// Overlay click guard (client component; safe to render from server)
import ClickUnlocker from "@/components/debug/ClickUnlocker";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const UI_VERSION = "cat-v16-subviews-1main+3thumbs";

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

// Legacy → new slug redirects
const LEGACY_TO_NEW: Record<string, string> = {
  "planners-productivity": "planners-and-productivity",
  "plr-mrr-bundles": "plr-and-mrr-bundles",
  "health-fitness-ebooks": "health-and-fitness-ebooks",
  "keto-diet-guides": "keto-and-diet-guides",
  "fonts": "fonts-and-icons",
};

const pub = (...p: string[]) => path.join(process.cwd(), "public", ...p);
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

// Canonical mapping page slug → CATEGORY_LABELS
const SLUG_TO_CANON_LABEL: Record<string, string> = {
  "ai-and-chatgpt-guides": CATEGORY_LABELS.AI,
  "planners-and-productivity": CATEGORY_LABELS.PLANNERS,
  "self-help-and-how-to": CATEGORY_LABELS.SELF_HELP,
  "plr-and-mrr-bundles": CATEGORY_LABELS.PLR,
  "video-courses-and-training": CATEGORY_LABELS.VIDEO,
  "complete-shop-packages": CATEGORY_LABELS.SHOP,
  "health-and-fitness-ebooks": CATEGORY_LABELS.HEALTH,
  "keto-and-diet-guides": CATEGORY_LABELS.KETO,
  "passive-income-and-side-hustles": CATEGORY_LABELS.PASSIVE,
  "web-templates": CATEGORY_LABELS.WEB,
  "digital-essentials-hub": CATEGORY_LABELS.ESSENTIALS,
  "fonts-and-icons": CATEGORY_LABELS.FONTS_ICONS,
  "religious-ebooks": CATEGORY_LABELS.RELIGIOUS,
  "social-media-kits": CATEGORY_LABELS.SOCIAL,
};

// --- Helpers for subcategories/imagery ---
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

const SUB_LABEL_KEYS = ["subcategory", "subCategory", "subcat", "subCat", "sub", "collection"];
const SUB_SLUG_KEYS  = ["subcategorySlug", "subCategorySlug", "subSlug"];

function readSubLabel(p: any): string | undefined {
  for (const k of SUB_LABEL_KEYS) if (p?.[k]) return String(p[k]);
  return undefined;
}
function readSubSlug(p: any): string | undefined {
  for (const k of SUB_SLUG_KEYS) if (p?.[k]) return String(p[k]);
  return undefined;
}
function effectiveSubSlug(p: any): string | null {
  const sslug = readSubSlug(p);
  if (sslug) return toSlug(sslug);
  const slabel = readSubLabel(p);
  if (slabel) return toSlug(slabel);
  return null;
}

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

function buildCardImages(p: any): string[] {
  const productImages = Array.isArray(p.images) ? (p.images as string[]) : [];
  const cover = (productImages[0] ?? p.image ?? "/images/placeholder.jpg") as string;

  const extrasFromProduct = productImages.slice(1).filter(Boolean);
  const extrasFromFS = readProductThumbs(p.slug, 3);

  const extras = Array.from(new Set([...extrasFromProduct, ...extrasFromFS]))
    .filter((src) => src && src !== cover)
    .slice(0, 3);

  return [cover, ...extras];
}

export function generateStaticParams() {
  const newSlugs = Object.keys(META);
  const legacySlugs = Object.keys(LEGACY_TO_NEW);
  return [...newSlugs, ...legacySlugs].map((slug) => ({ slug }));
}

const normalizeSlug = (s: string) => LEGACY_TO_NEW[s] ?? s;

export async function generateMetadata(props: any) {
  const raw = String(props?.params?.slug ?? "");
  const slug = normalizeSlug(raw);
  const m = META[slug];
  const title = m ? `${m.title} | Digital Products Artisan` : "Digital Products | Digital Products Artisan";
  const description = m?.description ?? "Browse our curated digital products.";
  const canonical = `https://digitalproductsartisan.com/categories/${encodeURIComponent(slug)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website", url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Promise-based props (Next 15)
type SP = Record<string, string | string[] | undefined>;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SP>;
}) {
  const { slug: rawSlug } = await params;
  const sp = (await searchParams) || {};

  const slug = normalizeSlug(String(rawSlug || ""));
  const meta = META[slug];

  // preserve all query params (currency, etc.)
  const spEntries = Object.entries(sp).filter(([_, v]) => v != null && v !== "");
  const qs = spEntries.length
    ? `?${new URLSearchParams(
        spEntries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v as string)])
      ).toString()}`
    : "";

  const subParam = Array.isArray(sp.sub) ? sp.sub[0] : sp.sub;
  const activeSub = subParam ? toSlug(String(subParam).trim()) : null;

  if (!meta) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main
        id="cat-scope"
        className="container mx-auto px-4 py-16 relative z-[100] clickable-surface"
        data-ui={`CategoryPage@${UI_VERSION}:not-found`}
        style={{ pointerEvents: "auto", isolation: "isolate" }}
      >
        <ClickUnlocker targetSelector='main[data-ui^="CategoryPage@"]' />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{pretty}</h1>
        <InlineMore
          text="We couldn’t find a dedicated page for this category yet. Explore best sellers below or visit all products."
          lines={1}
          minChars={40}
          className="text-gray-700"
        />
        <p className="mt-2">
          <Link href={`/products${qs}`} className="underline" prefetch={false}>Browse all products →</Link>
        </p>
      </main>
    );
  }

  // Canonical category lookup
  const canonicalLabel = SLUG_TO_CANON_LABEL[slug];
  let catProducts = canonicalLabel
    ? productsInCategory(canonicalLabel)
    : products.filter((p) => {
        const eff = effectiveProductCategorySlug(p);
        return eff !== "__HIDE__" && eff === slug;
      });

  // Group by optional subcategory fields
  const groups = new Map<string, { label: string; items: any[] }>();
  for (const p of catProducts) {
    const sslug = effectiveSubSlug(p) ?? "__none__";
    const label =
      readSubLabel(p) ??
      (sslug === "__none__"
        ? "Other"
        : sslug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()));
    if (!groups.has(sslug)) groups.set(sslug, { label, items: [] });
    groups.get(sslug)!.items.push(p);
  }

  let visibleGroups = groups;
  if (activeSub) {
    visibleGroups = new Map();
    const pick = groups.get(activeSub);
    if (pick) visibleGroups.set(activeSub, pick);
  }

  const toCard = (p: any) => {
    const imagesRaw = buildCardImages(p);
    const images = Array.from(new Set(imagesRaw)).map((src) =>
      src.includes("?") ? `${src}&v=${UI_VERSION}` : `${src}?v=${UI_VERSION}`
    );
    const seg = encodeURIComponent(String(p.slug ?? p.id));
    const href = `/products/${seg}${qs}`; // keep query string (currency, etc.)
    return { id: p.id, title: p.title, slug: p.slug, price: p.price, images, description: p.description, href };
  };

  const totalVisible = Array.from(visibleGroups.values()).reduce((n, g) => n + g.items.length, 0);

  return (
    <main
      id="cat-scope"
      className="container mx-auto px-4 py-12 relative z-[100] clickable-surface"
      data-ui={`CategoryPage@${UI_VERSION}`}
      style={{ pointerEvents: "auto", isolation: "isolate" }}
    >
      {/* SSR-scoped safety styles: push overlays behind and force click-through */}
      <style>{`
        #cat-scope .hero-overlay,
        #cat-scope .gradient-overlay,
        #cat-scope .noise-overlay,
        #cat-scope .overlay,
        #cat-scope [data-overlay],
        #cat-scope [data-decorative="true"],
        #cat-scope [class*="overlay-"],
        #cat-scope [class$="-overlay"],
        #cat-scope .fixed-overlay,
        #cat-scope .absolute-overlay,
        #cat-scope [data-blocking-overlay="true"] {
          pointer-events: none !important;
          z-index: -1 !important;
        }
        #cat-scope #subcat-nav,
        #cat-scope #subcat-nav *,
        #cat-scope [data-grid="products"],
        #cat-scope [data-grid="products"] * {
          pointer-events: auto !important;
          position: relative;
          z-index: 25;
        }
        #cat-scope a, #cat-scope button, #cat-scope [role="button"] {
          pointer-events: auto !important;
          position: relative;
          z-index: 30;
        }
      `}</style>

      {/* extra runtime guard against unknown overlays */}
      <ClickUnlocker targetSelector="#subcat-nav" />
      <ClickUnlocker targetSelector='div[data-grid="products"]' />

      <h1 className="text-3xl md:text-4xl font-bold">
        {meta.title}
        {activeSub ? `: ${(groups.get(activeSub)?.label ?? activeSub).replace(/\b\w/g,(m)=>m.toUpperCase())}` : ""}
      </h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="mt-1 text-gray-700" />

      {/* Subcategory pills */}
      {!activeSub && groups.size > 1 && (
        <div
          id="subcat-nav"
          className="mt-4 flex flex-wrap gap-2 relative z-[101] clickable-surface"
          data-subcats="true"
          style={{ pointerEvents: "auto", isolation: "isolate" }}
        >
          {Array.from(groups.entries())
            .filter(([k]) => k !== "__none__")
            .map(([k, g]) => (
              <Link
                key={k}
                href={{ pathname: `/categories/${encodeURIComponent(slug)}`, query: { ...Object.fromEntries(spEntries), sub: k } }}
                prefetch={false}
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/30"
                aria-label={`View subcategory ${g.label}`}
                style={{ pointerEvents: "auto", position: "relative", zIndex: 102 }}
              >
                {g.label}
              </Link>
            ))}
        </div>
      )}

      {totalVisible ? (
        activeSub ? (
          <div
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-[100] clickable-surface"
            data-grid="products"
            style={{ pointerEvents: "auto", isolation: "isolate" }}
          >
            {visibleGroups.get(activeSub)!.items.map((p) => (
              <ProductCardV4 key={`${UI_VERSION}:${String(p.slug ?? p.id)}`} {...toCard(p)} />
            ))}
          </div>
        ) : (
          <div
            className="mt-6 space-y-10 relative z-[100] clickable-surface"
            data-grid="products"
            style={{ pointerEvents: "auto", isolation: "isolate" }}
          >
            {Array.from(groups.entries()).map(([k, g]) => (
              <section key={k} data-sub={k}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{g.label}</h2>
                  {k !== "__none__" && (
                    <Link
                      href={{ pathname: `/categories/${encodeURIComponent(slug)}`, query: { ...Object.fromEntries(spEntries), sub: k } }}
                      prefetch={false}
                      className="text-sm underline"
                      aria-label={`View all in ${g.label}`}
                      style={{ pointerEvents: "auto" }}
                    >
                      View all →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((p) => (
                    <ProductCardV4 key={`${UI_VERSION}:${String(p.slug ?? p.id)}`} {...toCard(p)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )
      ) : (
        <div className="mt-8">
          <p className="text-gray-600">No products in {activeSub ? "this subcategory" : "this category"} yet.</p>
          <Link href={`/products${qs}`} prefetch={false} className="mt-3 inline-block underline">
            Browse all products →
          </Link>
        </div>
      )}
    </main>
  );
}
