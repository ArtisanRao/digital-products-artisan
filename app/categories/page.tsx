"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import InlineMore from "@/components/ui/inline-more";

const categories = [
  { name: "💪 Health & Fitness eBooks",       slug: "health-and-fitness-ebooks",      image: "/images/ebooks-cover.jpg",                 desc: "Digital books, guides, and educational content." },
  { name: "🤖 AI & ChatGPT Guides",           slug: "ai-and-chatgpt-guides",          image: "/images/digital-art-cover.jpg",            desc: "Step-by-step tutorials, playbooks, and use-cases for AI." },
  { name: "🧰 Complete Shop Packages",        slug: "complete-shop-packages",         image: "/images/business-templates-cover.jpg",     desc: "Ready-to-sell, rebrandable bundles for instant storefronts." },
  { name: "📥 Marketing Tools",               slug: "marketing-tools",                image: "/images/marketing-tools-cover.jpg",        desc: "Prompts, swipe files, and growth resources for marketing." },
  { name: "🗓️ Planners & Productivity",       slug: "planners-and-productivity",      image: "/images/printable-planners-cover.jpg",     desc: "Digital planners, journals, and productivity tools." },
  { name: "📖 Self-Help & How-To",            slug: "self-help-and-how-to",           image: "/images/photography-prints-cover.jpg",     desc: "Actionable guides and practical skills for everyday life." },
  { name: "🥗 Keto & Diet Guides",            slug: "keto-and-diet-guides",           image: "/images/fonts-cover.jpg",                  desc: "Meal plans, shopping lists, and nutrition tracking." },
  { name: "💼 Passive Income & Side Hustles", slug: "passive-income-and-side-hustles", image: "/images/icons-cover.jpg",                  desc: "Blueprints, checklists, and kits to start earning online." },
  { name: "🌐 Web Templates",                 slug: "web-templates",                  image: "/images/web-templates-cover.jpg",          desc: "Website templates, UI kits, and themes." },
  { name: "🎬 Video Courses & Training",      slug: "video-courses-and-training",     image: "/images/video-resources-cover.jpg",        desc: "Step-by-step video lessons, screenflows, and workshops." },
  { name: "🏷️ PLR & MRR Bundles",            slug: "plr-and-mrr-bundles",            image: "/images/audio-samples-cover.jpg",          desc: "Rebrandable products with resale rights to grow fast." },
  { name: "🤝 Social Media Kits",             slug: "social-media-kits",              image: "/images/social-media-kits-cover.jpg",      desc: "Packaged posts, graphics, and assets for social channels." },
  { name: "🧠 Prompt Packs & AI Tools",       slug: "prompt-packs-and-ai-tools",      image: "/images/marketing-tools-cover.jpg",        desc: "Curated prompt packs, automations, and AI utilities." },
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

              {/* Inline “more / less” under the subtitle */}
              <InlineMore
                text={category.desc}
                lines={2}
                minChars={1}
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
