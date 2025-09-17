"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

type Item = {
  id: string;        // stable key
  slug: string;
  title: string;
  price: number;     // keep as number
  description: string;
};

const CAT = "web-templates";

// Try multiple sensible filenames: category folder, root, and -cover variants
const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/web-templates-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const items: Item[] = [
  { id: "web-templates",     slug: "web-templates",     title: "Web Templates Bundle", price: 9.99, description: "Landing pages, blogs & more." },
  { id: "contract-templates", slug: "contract-templates", title: "Contract Templates",    price: 5.49, description: "Professional legal templates." },
  { id: "excel-tracker",      slug: "excel-tracker",      title: "Excel Tracker",         price: 4.99, description: "Track KPI, finances, goals." },
  // add more; the expander will handle the rest
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function WebTemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🌐 Web Templates</h1>

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
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="16/9" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>
                <p className="mb-2 text-sm text-gray-600">{p.description}</p>
                <p className="mb-3 text-lg font-bold">{formatEUR(price)}</p>

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
