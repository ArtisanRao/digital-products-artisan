"use client";

import { useEffect, useState } from "react";
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

// ultra-light breakpoint helper (mobile-first)
function getCollapsedCount(width: number) {
  // grid: base=1 col → 2 items (2 rows)
  // sm (≥640px)=2 cols → 4 items
  // md+ (≥768px)=3 cols → 6 items
  if (width >= 768) return 6;
  if (width >= 640) return 4;
  return 2;
}

export default function CategoriesPage() {
  const [collapsedCount, setCollapsedCount] = useState(6); // default for SSR hydration
  const [visible, setVisible] = useState(6);
  const [expanded, setExpanded] = useState(false);

  // compute initial collapsed count on mount and on resize
  useEffect(() => {
    const apply = () => {
      const c = getCollapsedCount(window.innerWidth);
      setCollapsedCount(c);
      setVisible(c);
      setExpanded(false);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const items = expanded ? categories : categories.slice(0, visible);
  const canExpand = categories.length > collapsedCount;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((category) => (
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
            <CoverImage
              src={category.image}
              alt={category.name}
              ratio="16/9"
              fit="contain"
              paddingClass="p-2"
              roundedClass="rounded-none"
              className="md:aspect-[3/2]"
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

      {canExpand && (
        <div className="mt-8 flex justify-center">
          {!expanded ? (
            <button
              onClick={() => { setExpanded(true); setVisible(categories.length); }}
              className="rounded-2xl border px-4 py-2 text-sm hover:bg-muted/30"
              aria-expanded={expanded}
            >
              Read more
            </button>
          ) : (
            <button
              onClick={() => { setExpanded(false); setVisible(collapsedCount); }}
              className="rounded-2xl px-4 py-2 text-sm underline"
              aria-expanded={expanded}
            >
              Show less
            </button>
          )}
        </div>
      )}
    </main>
  );
}
