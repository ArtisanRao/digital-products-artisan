"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";

const categories = [
  { name: "📚 eBooks",             slug: "ebooks",               image: "/images/ebooks-cover.jpg" },
  { name: "🎨 Digital Art",        slug: "digital-art",          image: "/images/digital-art-cover.jpg" },
  { name: "🧾 Templates",          slug: "business-templates",   image: "/images/business-templates-cover.jpg" },
  { name: "📥 Marketing Tools",    slug: "marketing-tools",      image: "/images/marketing-tools-cover.jpg" },
  { name: "🗓️ Printable Planners", slug: "printable-planners",   image: "/images/printable-planners-cover.jpg" },
  { name: "📸 Photography Prints", slug: "photography-prints",   image: "/images/photography-prints-cover.jpg" },
  { name: "🔤 Fonts",              slug: "fonts",                image: "/images/fonts-cover.jpg" },
  { name: "🔘 Icons",              slug: "icons",                image: "/images/icons-cover.jpg" },
  { name: "🌐 Web Templates",      slug: "web-templates",        image: "/images/web-templates-cover.jpg" },
  { name: "🎥 Video Resources",    slug: "video-resources",      image: "/images/video-resources-cover.jpg" },
  { name: "🎵 Audio Samples",      slug: "audio-samples",        image: "/images/audio-samples-cover.jpg" },
  { name: "📱 Social Media Kits",  slug: "social-media-kits",    image: "/images/social-media-kits-cover.jpg" },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            aria-label={`Browse ${category.name}`}
            className="
              group block rounded-2xl border overflow-hidden bg-white
              shadow transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2
            "
          >
            {/* Perfectly-fit, hoverable cover (no crop) */}
            <CoverImage
              src={category.image}
              alt={category.name}
              ratio="16/9"
              fit="contain"
              paddingClass="p-2"
              roundedClass="rounded-none"                         /* keep card’s outer rounding */
              className="md:aspect-[3/2]"                         /* 16:9 → 3/2 on md+ for nicer balance */
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
