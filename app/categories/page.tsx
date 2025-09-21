"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more";

const categories = [
  { name: "ðŸ“š eBooks",             slug: "ebooks",               image: "/images/ebooks-cover.jpg",               desc: "Digital books, guides, and educational content." },
  { name: "ðŸŽ¨ Digital Art",        slug: "digital-art",          image: "/images/digital-art-cover.jpg",          desc: "Illustrations, posters, wallpapers and creative assets." },
  { name: "ðŸ§¾ Templates",          slug: "business-templates",   image: "/images/business-templates-cover.jpg",   desc: "Design templates and graphics ready to use." },
  { name: "ðŸ“¥ Marketing Tools",    slug: "marketing-tools",      image: "/images/marketing-tools-cover.jpg",      desc: "Prompts, swipe files, and growth resources for marketing." },
  { name: "ðŸ—“ï¸ Printable Planners", slug: "printable-planners",   image: "/images/printable-planners-cover.jpg",   desc: "Digital planners, journals, and productivity tools." },
  { name: "ðŸ“¸ Photography Prints", slug: "photography-prints",   image: "/images/photography-prints-cover.jpg",   desc: "High-quality photo prints, presets, and media assets." },
  { name: "ðŸ”¤ Fonts",              slug: "fonts",                image: "/images/fonts-cover.jpg",                desc: "Display, serif, sans and script fonts for your projects." },
  { name: "ðŸ”˜ Icons",              slug: "icons",                image: "/images/icons-cover.jpg",                desc: "Clean, scalable icon packs for UI and branding." },
  { name: "ðŸŒ Web Templates",      slug: "web-templates",        image: "/images/web-templates-cover.jpg",        desc: "Website templates, UI kits, and themes." },
  { name: "ðŸŽ¥ Video Resources",    slug: "video-resources",      image: "/images/video-resources-cover.jpg",      desc: "Stock footage, overlays, LUTs, and templates." },
  { name: "ðŸŽµ Audio Samples",      slug: "audio-samples",        image: "/images/audio-samples-cover.jpg",        desc: "Loops, one-shots, SFX and music beds for creators." },
  { name: "ðŸ“± Social Media Kits",  slug: "social-media-kits",    image: "/images/social-media-kits-cover.jpg",    desc: "Packaged posts, graphics, and assets for social channels." },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">ðŸ—‚ï¸ All Categories</h1>

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

              {/* Inline â€œmore / lessâ€ under the subtitle */}
              <InlineMore
                text={category.desc}
                lines={2}
                minChars={1}                 // always show the toggle
                className="mt-1 text-sm text-gray-600"
                moreLabel="more"
                lessLabel="less"
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
