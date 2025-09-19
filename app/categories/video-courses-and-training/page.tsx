"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const IMG_FOLDER = "video-resources";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const items: Item[] = [
  { id: "video-courses-hub", slug: "video-courses-hub", title: "Video Courses Hub", price: 8.99, description: "Lessons, B-roll, lower thirds, overlays." },
  { id: "stock-footage-mega-bundle", slug: "stock-footage-mega-bundle", title: "Stock Footage Mega Bundle", price: 12.99, description: "Huge, royalty-free stock set." },
  { id: "youtube-channel-kit", slug: "youtube-channel-kit", title: "YouTube Channel Kit", price: 6.49, description: "Intros, end screens, thumbnails." },
];

const imgCandidates = (slug: string) => [
  `/images/${IMG_FOLDER}/${slug}.jpg`,
  `/images/${IMG_FOLDER}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${IMG_FOLDER}/cover.jpg`,
  `/images/${IMG_FOLDER}-cover.jpg`,
  `/images/video-resources-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function VideoCoursesAndTrainingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎬 Video Courses & Training</h1>

      <CategoryGrid
        items={items}
        renderItem={(p) => {
          const slug = p.slug ?? String(p.id);
          const price =
            typeof p.price === "number" ? p.price :
            typeof p.price === "string" ? parseFloat(p.price) : 0;

          const primaryImg = `/images/${IMG_FOLDER}/${slug}.jpg`;

          return (
            <div
              key={String(p.id)}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.title}</h2>

                {/* Inline “More / Less” under subtitle — force show using minChars */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold">{formatEUR(price)}</p>

                {/* View (checkout) + Add to Cart */}
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
