import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more"; // per-paragraph “More/Less”

type CatInfo = { title: string; description: string; folder: string };

// Slug → UI text + folder under /public/images/<folder>
const CATEGORIES: Record<string, CatInfo> = {
  // ===== New canonical slugs =====
  "health-and-fitness-ebooks":      { title: "Health & Fitness eBooks",       description: "Digital books, guides, and educational content.",            folder: "ebooks" },
  "ai-and-chatgpt-guides":          { title: "AI & ChatGPT Guides",           description: "Step-by-step tutorials, playbooks, and use-cases for AI.",   folder: "digital-art" },
  "complete-shop-packages":         { title: "Complete Shop Packages",        description: "Ready-to-sell, rebrandable bundles for instant storefronts.", folder: "templates" },
  "marketing-tools":                { title: "Marketing Tools",               description: "Prompts, swipe files, and growth resources for marketing.",  folder: "marketing-tools" },
  "planners-and-productivity":      { title: "Planners & Productivity",       description: "Digital planners, journals, and productivity tools.",        folder: "printable-planners" },
  "self-help-and-how-to":           { title: "Self-Help & How-To",            description: "Actionable guides and practical skills for everyday life.",  folder: "photography-prints" },
  "keto-and-diet-guides":           { title: "Keto & Diet Guides",            description: "Meal plans, shopping lists, and nutrition tracking.",        folder: "fonts" },
  "passive-income-and-side-hustles":{ title: "Passive Income & Side Hustles", description: "Blueprints, checklists, and kits to start earning online.",  folder: "icons" },
  "web-templates":                  { title: "Web Templates",                 description: "Website templates, UI kits, and themes.",                    folder: "web-templates" },
  "video-courses-and-training":     { title: "Video Courses & Training",      description: "Step-by-step video lessons, screenflows, and workshops.",   folder: "video-resources" },
  "plr-and-mrr-bundles":            { title: "PLR & MRR Bundles",             description: "Rebrandable products with resale rights to grow fast.",      folder: "audio-samples" },
  "social-media-kits":              { title: "Social Media Kits",             description: "Packaged posts, graphics, and assets for social channels.",  folder: "social-media-kits" },
  "prompt-packs-and-ai-tools":      { title: "Prompt Packs & AI Tools",       description: "Curated prompt packs, automations, and AI utilities.",       folder: "marketing-tools" },

  // ===== Legacy slugs → still render (plus server redirects in next.config.js) =====
  ebooks:               { title: "Health & Fitness eBooks",       description: "Digital books, guides, and educational content.",            folder: "ebooks" },
  "digital-art":        { title: "AI & ChatGPT Guides",           description: "Step-by-step tutorials, playbooks, and use-cases for AI.",   folder: "digital-art" },
  templates:            { title: "Complete Shop Packages",        description: "Ready-to-sell, rebrandable bundles for instant storefronts.", folder: "templates" },
  "printable-planners": { title: "Planners & Productivity",       description: "Digital planners, journals, and productivity tools.",        folder: "printable-planners" },
  "photography-prints": { title: "Self-Help & How-To",            description: "Actionable guides and practical skills for everyday life.",  folder: "photography-prints" },
  fonts:                { title: "Keto & Diet Guides",            description: "Meal plans, shopping lists, and nutrition tracking.",        folder: "fonts" },
  icons:                { title: "Passive Income & Side Hustles", description: "Blueprints, checklists, and kits to start earning online.",  folder: "icons" },
  "video-resources":    { title: "Video Courses & Training",      description: "Step-by-step video lessons, screenflows, and workshops.",   folder: "video-resources" },
  "audio-samples":      { title: "PLR & MRR Bundles",             description: "Rebrandable products with resale rights to grow fast.",      folder: "audio-samples" },

  // Older alternates you had
  "ebooks-guides":       { title: "Health & Fitness eBooks",       description: "Digital books, guides, and educational content.",            folder: "ebooks" },
  "templates-graphics":  { title: "Complete Shop Packages",        description: "Ready-to-sell, rebrandable bundles for instant storefronts.", folder: "templates" },
  "business-templates":  { title: "Complete Shop Packages",        description: "Ready-to-sell, rebrandable bundles for instant storefronts.", folder: "templates" },
  "ai-prompts":          { title: "Prompt Packs & AI Tools",       description: "Curated prompt packs, automations, and AI utilities.",       folder: "marketing-tools" },
  "planners-organizers": { title: "Planners & Productivity",       description: "Digital planners, journals, and productivity tools.",        folder: "printable-planners" },
  "code-development":    { title: "Social Media Kits",             description: "Packaged posts, graphics, and assets for social channels.",  folder: "social-media-kits" },
  "photography-media":   { title: "Self-Help & How-To",            description: "Actionable guides and practical skills for everyday life.",  folder: "photography-prints" },
};

// Pre-render all known slugs
export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  const title = cat ? `${cat.title} | Digital Products Artisan` : "Digital Products | Digital Products Artisan";
  const description = cat?.description ?? "Browse our curated digital products.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Read all images in /public/images/<folder>
function listFolderImages(folder: string) {
  const dir = path.join(process.cwd(), "public", "images", folder);
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && /\.(png|jpe?g|webp|avif|gif)$/i.test(d.name))
      .map((d) => ({
        src: `/images/${folder}/${d.name}`,
        title: d.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      }))
      .sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];

  if (!cat) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{pretty}</h1>

        {/* Inline More/Less (force link when text is at least ~40 chars) */}
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

  const items = listFolderImages(cat.folder);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{cat.title}</h1>

      {/* Category description with inline “More / Less” */}
      <InlineMore text={cat.description} lines={1} minChars={40} className="text-gray-700 mb-2" />

      {items.length ? (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.src} className="rounded-xl border bg-white hover:shadow-lg transition">
              <CoverImage
                src={it.src}
                alt={it.title}
                ratio="3/2"
                fit="contain"
                hover
                paddingClass="p-2"
                roundedClass="rounded-xl"
                sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
              />
              <div className="px-3 py-2">
                <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-600">
          No covers found in <code>/public/images/{cat.folder}</code>. Add images (jpg, png, webp, avif) and redeploy.
        </p>
      )}

      <div className="mt-8">
        <Link href="/products" className="inline-block underline">Browse all products →</Link>
      </div>
    </main>
  );
}
