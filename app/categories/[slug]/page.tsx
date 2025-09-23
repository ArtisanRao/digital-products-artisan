import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { products } from "@/data/products";

/** UI copy per slug */
const META: Record<string, { title: string; description: string }> = {
  "ai-and-chatgpt-guides":      { title: "AI & ChatGPT Guides",     description: "Guides, prompts and AI learning resources." },
  "planners-productivity":      { title: "Planners & Productivity", description: "Digital planners, journals and productivity tools." },
  "self-help-and-how-to":       { title: "Self-Help & How-To",      description: "Practical how-to guides and self-improvement." },
  "plr-mrr-bundles":            { title: "PLR & MRR Bundles",       description: "Done-for-you PLR/MRR products and kits." },
  "video-courses-and-training": { title: "Video Courses & Training",description: "Structured video lessons and trainings." },
  "complete-shop-packages":     { title: "Complete Shop Packages",  description: "Turn-key storefront bundles and assets." },
  "health-fitness-ebooks":      { title: "Health & Fitness eBooks", description: "Nutrition, fitness and wellness books." },
  "keto-diet-guides":           { title: "Keto & Diet Guides",      description: "Keto and nutrition programs and meal plans." },
  "passive-income-side-hustles":{ title: "Passive Income & Side Hustles", description: "Monetization playbooks and templates." },
  "web-templates":              { title: "Web Templates",           description: "Website templates, UI kits and themes." },
  "digital-essentials-hub":     { title: "Digital Essentials Hub",  description: "Prompt packs, automations, and utilities." },
  "fonts":                      { title: "Fonts & Icons",           description: "Font families and icon sets." },
  "religious-ebooks":           { title: "Religious eBooks",        description: "Faith-centered books, devotionals and study guides." },
  "social-media-kits":          { title: "Social Media Kits",       description: "Post templates and brandable assets for socials." },
};

const FALLBACK_BY_SLUG: Record<string, string[]> = {
  "ai-and-chatgpt-guides":       ["ai-&-chatgpt-guides.jpg", "ai-chatgpt-guides.jpg"],
  "planners-productivity":       ["planners-&-productivity.jpg", "planners-productivity.jpg", "planners-productivity.png"],
  "self-help-and-how-to":        ["self-help-&-how-to.jpg", "self-help-how-to.jpg"],
  "plr-mrr-bundles":             ["plr-&-mrr-bundles.jpg", "plr-mrr-bundles.jpg"],
  "video-courses-and-training":  ["video-courses-&-training.jpg", "video-courses-training.jpg"],
  "complete-shop-packages":      ["complete-shop-packages.jpg"],
  "health-fitness-ebooks":       ["health-&-fitness-ebooks.jpg", "health-fitness-ebooks.jpg"],
  "keto-diet-guides":            ["keto-&-diet-guides.jpg", "keto-diet-guides.jpg"],
  "passive-income-side-hustles": ["passive-income-&-side-hustles.jpg", "passive-income-side-hustles.jpg"],
  "web-templates":               ["web-templates.jpg", "web-templates1.jpg", "web-templates2.jpg"],
  "digital-essentials-hub":      ["digital-essentials-hub.jpg", "prompt-packs-&-ai-tools.jpg", "prompt-packs-ai-tools.jpg"],
  "social-media-kits":           ["social-media-kits.jpg", "social-media-kits-cover.jpg"],
  "fonts":                       ["fonts-&-icons.jpg", "fonts.jpg"],
  "religious-ebooks":            ["religious-ebooks.jpg"],
};

export function generateStaticParams() {
  return Object.keys(META).map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
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

/** Optional: show any root images that start with the slug (if you add more later) */
function listRootImagesBySlugPrefix(slug: string) {
  const dir = path.join(process.cwd(), "public", "images");
  try {
    const all = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && /\.(png|jpe?g|webp|avif|gif)$/i.test(d.name))
      .map((d) => d.name);
    const prefix = `${slug}`.toLowerCase();
    return all
      .filter((name) => name.toLowerCase().startsWith(prefix))
      .map((name) => ({
        src: `/images/${name}`,
        title: name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
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

  // === Show products belonging to this category label ===
  const label = meta.title; // products use the label string in `category`
  const catProducts = products.filter((p) => p.category === label);

  // Image fallbacks (covers)
  const gallery = listRootImagesBySlugPrefix(slug);
  const fallbacks = FALLBACK_BY_SLUG[slug] ?? [];
  const fallbackSrc = fallbacks.length ? `/images/${fallbacks[0]}` : undefined;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.title}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {catProducts.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catProducts.map((p) => (
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
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
                  <div className="mt-2 font-semibold">${p.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>

          {(gallery.length > 0 || fallbackSrc) && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold">Category Covers</h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {(gallery.length ? gallery : [{ src: fallbackSrc!, title: `${meta.title} cover` }]).map((it) => (
                  <div key={it.src} className="rounded-xl border bg-white hover:shadow-lg transition">
                    <img src={it.src} alt={it.title} className="w-full h-auto object-contain p-2 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        // No products yet → just show the single cover (or gallery if present)
        <>
          {(gallery.length > 0 || fallbackSrc) ? (
            <div className="mt-8 rounded-xl border bg-white p-2">
              <div className="aspect-[16/9] md:aspect-[3/2]">
                <img
                  src={(gallery[0]?.src ?? fallbackSrc)!}
                  alt={`${meta.title} cover`}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-gray-600">No matching images found in <code>/public/images</code>.</p>
          )}

          <div className="mt-8">
            <Link href="/products" className="inline-block underline">Browse all products →</Link>
          </div>
        </>
      )}
    </main>
  );
}
