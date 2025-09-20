"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

type Item = {
  id: string;
  slug?: string; // optional; we’ll default to id
  title: string;
  image: string;
  price: number;
  description: string;
  fileUrl: string;
};

const items: Item[] = [
  {
    id: "productivity-extensions-bundle",
    title: "Productivity Extensions Bundle",
    image: "/images/software-plugins-cover.jpg",
    price: 6.95,
    description: "Chrome extensions and tools to boost workflow and efficiency.",
    fileUrl: "/downloads/productivity-extensions.zip",
  },
  {
    id: "creative-tools-designer",
    title: "Creative Tools for Designers",
    image: "/images/digital-art-cover.jpg",
    price: 5.75,
    description: "Design-focused plugins and mockup generators.",
    fileUrl: "/downloads/creative-designer-tools.zip",
  },
  {
    id: "notion-automation-pack",
    title: "Notion Automation Plugins",
    image: "/images/50-powerful-prompts-notion-format.jpg",
    price: 4.95,
    description: "Custom integrations and scripts for Notion workflows.",
    fileUrl: "/downloads/notion-automation-pack.zip",
  },
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function SoftwarePluginsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧩 Software Plugins</h1>

      <CategoryGrid
        items={items}
        renderItem={(p, i) => {
          const id = String(p.id);
          const slug = p.slug ?? id;
          const title = p.title;
          const image = typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg";
          const description = p.description ?? (items[i] as any)?.description ?? "";
          const price =
            typeof p.price === "number"
              ? p.price
              : typeof p.price === "string"
              ? parseFloat(p.price)
              : Number((items[i] as any)?.price ?? 0);

          const detailHref = `/products/${encodeURIComponent(slug)}`; // ← single product page

          return (
            <div
              key={id}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>

                {/* Inline “More / Less” under subtitle — force visible */}
                <InlineMore
                  text={description}
                  lines={2}
                  minChars={1}
                  className="text-gray-600 text-sm mb-2"
                />

                <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                <ShopActions
                  item={{
                    ...(items[i] as any),
                    id,
                    title,
                    image,
                    price,
                    description,
                  }}
                  viewHref={detailHref}       // ← View → product detail
                  goToCartAfterAdd={false}    // stay on grid after add
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
