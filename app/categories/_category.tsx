import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more"; // per-paragraph “More/Less”

type CatInfo = { title: string; description: string; folder: string };

// Slug → UI text + folder under /public/images/<folder>
const CATEGORIES: Record<string, CatInfo> = {
  // ✅ New / Renamed top-level
  "ai-and-chatgpt-guides":      { title: "AI & ChatGPT Guides",      description: "Guides, prompt engineering, and AI workflows for creators and businesses.", folder: "ai-and-chatgpt-guides" },
  "planners-and-productivity":  { title: "Planners & Productivity",  description: "Digital planners, journals, and simple systems to stay focused and consistent.", folder: "planners-and-productivity" },
  "self-help-and-how-to":       { title: "Self-Help & How-To",       description: "Step-by-step guides and practical playbooks to learn, improve, and ship.", folder: "self-help-and-how-to" },
  "plr-and-mrr-bundles":        { title: "PLR & MRR Bundles",        description: "Editable, rebrandable products with resale rights to jump-start your catalog.", folder: "plr-and-mrr-bundles" },
  "video-courses-and-training": { title: "Video Courses & Training", description: "Structured video lessons, screenflows, and workshops.", folder: "video-courses-and-training" },
  "complete-shop-packages":     { title: "Complete Shop Packages",   description: "Done-for-you, ready-to-sell storefront packs with covers, copy, and files.", folder: "complete-shop-packages" },
  "health-and-fitness-ebooks":  { title: "Health & Fitness eBooks",  description: "Actionable ebooks to build healthy routines, strength, and energy.", folder: "health-and-fitness-ebooks" },
  "keto-and-diet-guides":       { title: "Keto & Diet Guides",       description: "Meal plans, recipes, and trackers to simplify your nutrition goals.", folder: "keto-and-diet-guides" },
  "passive-income-and-side-hustles": { title: "Passive Income & Side Hustles", description: "Blueprints, checklists, and assets to launch and scale micro-businesses.", folder: "passive-income-and-side-hustles" },
  "prompt-packs-and-ai-tools":  { title: "Prompt Packs & AI Tools",  description: "Ready-to-use prompt packs, automations, and utility kits for AI.", folder: "prompt-packs-and-ai-tools" },

  // Other existing groups (unchanged)
  "marketing-tools":   { title: "Marketing Tools",   description: "Prompts, swipe files, and growth resources for marketing.", folder: "marketing-tools" },
  "social-media-kits": { title: "Social Media Kits", description: "Packaged posts, graphics, and assets for social channels.", folder: "social-media-kits" },
  "software-plugins":  { title: "Software Plugins",  description: "Utilities and add-ons to extend your workflows.", folder: "software-plugins" },
  "web-templates":     { title: "Web Templates",     description: "Website templates, UI kits, and themes.", folder: "web-templates" },

  // Children under Web Templates
  "web-templates/fonts": { title: "Fonts", description: "Display, serif, sans, and script fonts for polished projects.", folder: "web-templates/fonts" },
  "web-templates/icons": { title: "Icons", description: "Clean, scalable icon packs for UI and branding.", folder: "web-templates/icons" },

  // Legacy aliases -> closest new locations
  "digital-art":        { title: "AI & ChatGPT Guides",      description: "Legacy route; forwarded to AI & ChatGPT Guides.",      folder: "ai-and-chatgpt-guides" },
  "printable-planners": { title: "Planners & Productivity",  description: "Legacy route; forwarded to Planners & Productivity.",  folder: "planners-and-productivity" },
  "photography-prints": { title: "Self-Help & How-To",       description: "Legacy route; forwarded to Self-Help & How-To.",       folder: "self-help-and-how-to" },
  "audio-samples":      { title: "PLR & MRR Bundles",        description: "Legacy route; forwarded to PLR & MRR Bundles.",        folder: "plr-and-mrr-bundles" },
  "video-resources":    { title: "Video Courses & Training", description: "Legacy route; forwarded to Video Courses & Training.",  folder: "video-courses-and-training" },
  "templates":          { title: "Complete Shop Packages",   description: "Legacy route; forwarded to Complete Shop Packages.",    folder: "complete-shop-packages" },
  "ebooks":             { title: "Health & Fitness eBooks",  description: "Legacy route; forwarded to Health & Fitness eBooks.",   folder: "health-and-fitness-ebooks" },
  "fonts":              { title: "Keto & Diet Guides",       description: "Legacy route; forwarded to Keto & Diet Guides.",        folder: "keto-and-diet-guides" },
  "icons":              { title: "Passive Income & Side Hustles", description: "Legacy route; forwarded to Passive Income & Side Hustles.", folder: "passive-income-and-side-hustles" },
};

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

export function generateCategoryMetadata(slug: string) {
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

// ---- component ----
function CategoryPage({ slug }: { slug: string }) {
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

export default CategoryPage;
export { CategoryPage, generateCategoryMetadata };
