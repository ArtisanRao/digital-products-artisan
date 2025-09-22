import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";

/** UI copy per slug (same slugs you already use elsewhere) */
const META: Record<
  string,
  { title: string; description: string }
> = {
  "ai-and-chatgpt-guides":      { title: "AI & ChatGPT Guides",     description: "Guides, prompts and AI learning resources." },
  "planners-productivity":      { title: "Planners & Productivity",  description: "Digital planners, journals and productivity tools." },
  "self-help-and-how-to":       { title: "Self-Help & How-To",       description: "Practical how-to guides and self-improvement." },
  "plr-mrr-bundles":            { title: "PLR & MRR Bundles",        description: "Done-for-you PLR/MRR products and kits." },
  "video-courses-and-training": { title: "Video Courses & Training", description: "Structured video lessons and trainings." },
  "complete-shop-packages":     { title: "Complete Shop Packages",   description: "Turn-key storefront bundles and assets." },
  "health-fitness-ebooks":      { title: "Health & Fitness eBooks",  description: "Nutrition, fitness and wellness books." },
  "keto-diet-guides":           { title: "Keto & Diet Guides",       description: "Keto and nutrition programs and meal plans." },
  "passive-income-side-hustles":{ title: "Passive Income & Side Hustles", description: "Monetization playbooks and templates." },
  "web-templates":              { title: "Web Templates",            description: "Website templates, UI kits and themes." },
  "prompt-packs-and-ai-tools":  { title: "Prompt Packs & AI Tools",  description: "Prompt packs and AI utilities." },
  "fonts":                      { title: "Fonts",                     description: "Display, serif, sans and script fonts." },
  "icons":                      { title: "Icons",                     description: "Clean, scalable icon packs for UI and branding." },
  "social-media-kits":          { title: "Social Media Kits",         description: "Post templates and brandable assets for socials." },
};

/** Map slug -> single fallback file under /public/images */
const FILENAME_BY_SLUG: Record<string, string> = {
  "ai-and-chatgpt-guides":       "ai-chatgpt-guides.jpg",
  "planners-productivity":       "planners-productivity.png",
  "self-help-and-how-to":        "self-help-how-to.jpg",
  "plr-mrr-bundles":             "plr-mrr-bundles.jpg",
  "video-courses-and-training":  "video-courses-training.jpg",
  "complete-shop-packages":      "complete-shop-packages.jpg",
  "health-fitness-ebooks":       "health-fitness-ebooks.jpg",
  "keto-diet-guides":            "keto-diet-guides.jpg",
  "passive-income-side-hustles": "passive-income-side-hustles.jpg",
  "web-templates":               "web-templates.jpg",
  "prompt-packs-and-ai-tools":   "prompt-packs-ai-tools.jpg",
  "fonts":                       "fonts.jpg",
  "icons":                       "icons.jpg",
  "social-media-kits":           "categories/social-media-kits/cover.png",
};

// Static params
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

/** List all files in /public/images whose filename starts with this slug (prefix match). */
function listRootImagesBySlugPrefix(slug: string) {
  const dir = path.join(process.cwd(), "public", "images");
  try {
    const all = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && /\.(png|jpe?g|webp|avif|gif)$/i.test(d.name))
      .map((d) => d.name);

    const prefix = `${slug}`;
    const matches = all
      .filter((name) => name.toLowerCase().startsWith(prefix.toLowerCase()))
      .map((name) => ({
        src: `/images/${name}`,
        title: name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }))
      .sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));

    return matches;
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

  const items = listRootImagesBySlugPrefix(slug);
  const hasGallery = items.length > 0;
  const fallback = FILENAME_BY_SLUG[slug] ? `/images/${FILENAME_BY_SLUG[slug]}` : undefined;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{meta.title}</h1>
      <InlineMore text={meta.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {hasGallery ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.src} className="rounded-xl border bg-white hover:shadow-lg transition">
              <img src={it.src} alt={it.title} className="w-full h-auto object-contain p-2 rounded-xl" />
              <div className="px-3 py-2">
                <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              </div>
            </div>
          ))}
        </div>
      ) : fallback ? (
        <div className="mt-8 rounded-xl border bg-white p-2">
          <div className="aspect-[16/9] md:aspect-[3/2]">
            <img src={fallback} alt={`${meta.title} cover`} className="h-full w-full object-contain" />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Add additional images in <code>/public/images</code> starting with <code>{slug}-…</code> to grow this gallery.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-gray-600">
          No matching images found in <code>/public/images</code>. Add files like <code>{slug}.jpg</code> (or <code>{slug}-1.jpg</code>) and redeploy.
        </p>
      )}

      <div className="mt-8">
        <Link href="/products" className="inline-block underline">Browse all products →</Link>
      </div>
    </main>
  );
}
