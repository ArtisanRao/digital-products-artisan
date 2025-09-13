// app/categories/[slug]/page.tsx
import Link from "next/link";
import FeaturedProducts from "@/components/featured-products";

type CatInfo = { title: string; description: string };

const CATEGORIES: Record<string, CatInfo> = {
  // New targets you asked for
  "ebooks":              { title: "eBooks",              description: "Digital books, guides, and educational content." },
  "templates":           { title: "Templates",           description: "Design templates and graphics ready to use." },
  "marketing-tools":     { title: "Marketing Tools",     description: "Prompts, swipe files, and growth resources for marketing." },
  "printable-planners":  { title: "Printable Planners",  description: "Digital planners, journals, and productivity tools." },
  "social-media-kits":   { title: "Social Media Kits",   description: "Packaged posts, graphics, and assets for social channels." },
  "photography-prints":  { title: "Photography Prints",  description: "High-quality photo prints, presets, and media assets." },

  // Old slugs (keep working links)
  "ebooks-guides":       { title: "eBooks",              description: "Digital books, guides, and educational content." },
  "templates-graphics":  { title: "Templates",           description: "Design templates and graphics ready to use." },
  "ai-prompts":          { title: "AI Prompts",          description: "Curated prompts for AI tools and platforms." },
  "planners-organizers": { title: "Printable Planners",  description: "Digital planners, journals, and productivity tools." },
  "code-development":    { title: "Social Media Kits",   description: "Packaged posts, graphics, and assets for social channels." },
  "photography-media":   { title: "Photography Prints",  description: "High-quality photo prints, presets, and media assets." },
};

// Pre-render everything we know
export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

// Next 15: params is a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];

  if (!cat) {
    const pretty = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{pretty}</h1>
        <p className="text-gray-600 mb-8">
          We couldn’t find a dedicated page for this category yet. Explore best sellers below or visit{" "}
          <Link href="/products" className="underline">all products</Link>.
        </p>
        <FeaturedProducts />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{cat.title}</h1>
      <p className="text-gray-600 mb-8">{cat.description}</p>

      {/* For now this shows best sellers. Later we can filter by slug. */}
      <FeaturedProducts />

      <div className="mt-8">
        <Link href="/products" className="inline-block underline">Browse all products →</Link>
      </div>
    </main>
  );
}
