import Link from "next/link";
import FeaturedProducts from "@/components/featured-products";

type CatInfo = { title: string; description: string };

const CATEGORIES: Record<string, CatInfo> = {
  "ebooks-guides": { title: "Ebooks & Guides", description: "Comprehensive guides and educational content." },
  "templates-graphics": { title: "Templates & Graphics", description: "Ready-to-use design templates and graphics." },
  "ai-prompts": { title: "AI Prompts", description: "Curated prompts for AI tools and platforms." },
  "planners-organizers": { title: "Planners & Organizers", description: "Digital planners and productivity tools." },
  "code-development": { title: "Code & Development", description: "Scripts, plugins, and development resources." },
  "photography-media": { title: "Photography & Media", description: "Stock photos, presets, and media assets." },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES[params.slug];
  const title = cat ? `${cat.title} | Digital Products Artisan` : "Digital Products | Digital Products Artisan";
  const description = cat?.description ?? "Browse our curated digital products.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES[params.slug];

  if (!cat) {
    const pretty = params.slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
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
      {/* For now, reuse FeaturedProducts. Later we can filter by category. */}
      <FeaturedProducts />
      <div className="mt-8">
        <Link href="/products" className="inline-block underline">Browse all products →</Link>
      </div>
    </main>
  );
}
