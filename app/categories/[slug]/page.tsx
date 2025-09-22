import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more";

type CatInfo = { title: string; description: string; folder: string };

// Slug → UI text + folder under /public/images/<folder>
const CATEGORIES: Record<string, CatInfo> = {
  "ai-chatgpt-guides":        { title: "AI & ChatGPT Guides",      description: "Guides, prompts and AI learning resources.",           folder: "ai-chatgpt-guides" },
  "planners-productivity":    { title: "Planners & Productivity",   description: "Digital planners, journals and productivity tools.",  folder: "planners-productivity" },
  "self-help-how-to":         { title: "Self-Help & How-To",        description: "Practical how-to guides and self-improvement.",       folder: "self-help-how-to" },
  "plr-mrr-bundles":          { title: "PLR & MRR Bundles",         description: "Done-for-you PLR/MRR products and kits.",             folder: "plr-mrr-bundles" },
  "video-courses-training":   { title: "Video Courses & Training",  description: "Structured video lessons and trainings.",              folder: "video-courses-training" },
  "complete-shop-packages":   { title: "Complete Shop Packages",    description: "Turn-key storefront bundles and assets.",              folder: "complete-shop-packages" },
  "health-fitness-ebooks":    { title: "Health & Fitness eBooks",   description: "Nutrition, fitness and wellness books.",              folder: "health-fitness-ebooks" },
  "keto-diet-guides":         { title: "Keto & Diet Guides",        description: "Keto and nutrition programs and meal plans.",         folder: "keto-diet-guides" },
  "passive-income-side-hustles": { title: "Passive Income & Side Hustles", description: "Monetization playbooks and templates.",        folder: "passive-income-side-hustles" },
  "web-templates":            { title: "Web Templates",             description: "Website templates, UI kits and themes.",              folder: "web-templates" },
  "prompt-packs-ai-tools":    { title: "Prompt Packs & AI Tools",   description: "Prompt packs and AI utilities.",                      folder: "prompt-packs-ai-tools" },
  "fonts":                    { title: "Fonts",                      description: "Display, serif, sans and script fonts.",             folder: "fonts" },
  "icons":                    { title: "Icons",                      description: "Clean, scalable icon packs for UI and branding.",    folder: "icons" },
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
        src: /images//,
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
