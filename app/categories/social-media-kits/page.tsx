"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

const CAT = "social-media-kits";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const items: Item[] = [
  { id: "social-media-kits", slug: "social-media-kits", title: "Social Media Kit", price: 5.99, description: "Ready-made posts & story sets." },
  { id: "instagram-branding-kit", slug: "instagram-branding-kit", title: "Instagram Branding Kit", price: 5.49, description: "On-brand templates for IG." },
  { id: "instagram-story-templates", slug: "instagram-story-templates", title: "IG Story Templates", price: 4.99, description: "Eye-catching stories in minutes." },
  // add more; the expander will handle the rest
];

// Try multiple sensible filenames (+ fallbacks)
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/social-media-kits-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function SocialMediaKitsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📱 Social Media Kits</h1>

      <CategoryGrid
        items={items}
        // two rows by default per breakpoint; reveals more with "Read more"
        renderItem={(p) => {
          // normalize for strict TS (CategoryGrid’s Product has optional fields)
          const slug = p.slug ?? String(p.id);
          const price =
            typeof p.price === "number"
              ? p.price
              : typeof p.price === "string"
              ? parseFloat(p.price)
              : 0;

          const primaryImg = `/images/${CAT}/${slug}.jpg`;

          return (
            <div
              key={String(p.id)}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                {/* Blue View + Add to Cart (same behavior as other categories) */}
                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
