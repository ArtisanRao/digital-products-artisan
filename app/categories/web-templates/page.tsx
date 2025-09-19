"use client";

import Link from "next/link";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

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
  { id: "web-templates",         slug: "web-templates",         title: "Web Templates Bundle",   price: 9.99, description: "Landing pages, blogs & more." },
  { id: "contract-templates",    slug: "contract-templates",    title: "Contract Templates",     price: 5.49, description: "Professional legal templates." },
  { id: "excel-tracker",         slug: "excel-tracker",         title: "Excel Tracker",          price: 4.99, description: "Track KPI, finances, goals." },
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

// Subcategory tiles shown beneath the main grid
const SUBCATS = [
  {
    slug: "fonts",
    name: "Fonts (Web Templates)",
    imgs: [
      "/images/web-templates/fonts.jpg",
      "/images/web-templates/fonts-cover.jpg",
      "/images/fonts-cover.jpg",
      "/images/placeholder-cover.jpg",
    ],
    desc: "Display, serif, sans & script packs tailored for the web.",
  },
  {
    slug: "icons",
    name: "Icons (Web Templates)",
    imgs: [
      "/images/web-templates/icons.jpg",
      "/images/web-templates/icons-cover.jpg",
      "/images/icons-cover.jpg",
      "/images/placeholder-cover.jpg",
    ],
    desc: "Clean, scalable icon packs for UI and branding.",
  },
];

export default function WebTemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">🌐 Web Templates</h1>

      {/* Main products */}
      <CategoryGrid
        items={items}
        renderItem={(p) => {
          const slug = p.slug ?? String(p.id);
          const price =
            typeof p.price === "number" ? p.price :
            typeof p.price === "string" ? parseFloat(p.price) : 0;

          const primaryImg = `/images/${CAT}/${slug}.jpg`;

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              <HoverableCover
                srcs={imgCandidates(slug)}
                alt={p.title}
                ratio="16/9"
                fit="contain"
              />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>

                {/* Inline “More / Less” under subtitle — always show using minChars */}
                <InlineMore
                  text={p.description}
                  lines={2}
                  minChars={1}
                  className="mb-2 text-sm text-gray-600"
                />

                <p className="mb-3 text-lg font-bold">{formatEUR(price)}</p>

                {/* View + Add to Cart */}
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

      {/* Subcategories under Web Templates */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold mb-6">Subcategories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SUBCATS.map((s) => (
            <Link
              key={s.slug}
              href={`/categories/web-templates/${s.slug}`}
              aria-label={`Browse ${s.name}`}
              className="group block overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
            >
              <HoverableCover srcs={s.imgs} alt={s.name} ratio="16/9" fit="contain" />
              <div className="p-4">
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
