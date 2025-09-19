"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const IMG_FOLDER = "audio-samples"; // keep existing images/folder

type Item = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
};

const items: Item[] = [
  {
    id: "plr-starter-bundle",
    slug: "plr-starter-bundle",
    title: "PLR Starter Bundle",
    price: 7.49,
    description: "Editable eBooks + checklists + mockups — resell with your branding.",
  },
  {
    id: "mrr-business-booster",
    slug: "mrr-business-booster",
    title: "MRR Business Booster",
    price: 6.99,
    description: "Master Resell Rights pack: sales page copy, covers, and lead magnets.",
  },
  {
    id: "plr-animated-launch-pack",
    slug: "plr-animated-launch-pack",
    title: "PLR Launch Pack",
    price: 5.99,
    description: "Promo graphics, captions, and email angles to launch faster.",
  },
];

const imgCandidates = (slug: string) => [
  `/images/${IMG_FOLDER}/${slug}.jpg`,
  `/images/${IMG_FOLDER}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${IMG_FOLDER}/cover.jpg`,
  `/images/${IMG_FOLDER}-cover.jpg`,
  `/images/audio-samples-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function PLRandMRRBundlesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🏷️ PLR & MRR Bundles</h1>

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

                {/* Inline “More / Less” under subtitle – force visible for short blurbs */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold">{formatEUR(price)}</p>

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
