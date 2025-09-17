"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const CAT = "video-resources";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const items: Item[] = [
  { id: "video-resources", slug: "video-resources",           title: "Video Resources Hub",       price: 8.99,  description: "B-roll, lower thirds, overlays." },
  { id: "stock-footage-mega-bundle", slug: "stock-footage-mega-bundle", title: "Stock Footage Mega Bundle", price: 12.99, description: "Huge, royalty-free stock set." },
  { id: "youtube-channel-kit", slug: "youtube-channel-kit",   title: "YouTube Channel Kit",       price: 6.49,  description: "Intros, end screens, thumbnails." },
];

// Try multiple sensible filenames (category folder, root, and -cover variants)
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/video-resources-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function VideoResourcesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎥 Video Resources</h1>

      <CategoryGrid
        items={items}
        renderItem={(p) => {
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

                {/* Inline “More / Less” under subtitle */}
                <InlineMore text={p.description} lines={2} className="text-gray-600 text-sm mb-2" />

                <p className="text-lg font-bold">{formatEUR(price)}</p>

                {/* Blue View + Add to Cart buttons */}
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
