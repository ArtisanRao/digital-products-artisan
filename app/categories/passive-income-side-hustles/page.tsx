"use client";

import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

const CAT = "icons";

type Item = {
  id: string;          // stable key
  slug: string;
  title: string;
  price: number;       // keep as number here
  description: string;
};

const items: Item[] = [
  { id: "minimal-icons-pack",  slug: "minimal-icons-pack",  title: "Minimal Icons Pack",  price: 4.99, description: "Clean, consistent 24px line icons for interfaces." },
  { id: "business-icons-pack", slug: "business-icons-pack", title: "Business Icons Pack", price: 5.49, description: "Office, finance & analytics icons for dashboards." },
  { id: "social-icons-pack",   slug: "social-icons-pack",   title: "Social Media Icons",  price: 3.99, description: "Brand-safe logos in multiple styles and sizes." },
];

const imgCandidates = (slug: string) => [
  `/images/${CAT}/${slug}.jpg`,
  `/images/${CAT}/${slug}-cover.jpg`,
  `/images/${slug}.jpg`,
  `/images/${slug}-cover.jpg`,
  `/images/${CAT}/cover.jpg`,
  `/images/${CAT}-cover.jpg`,
  `/images/${CAT}.jpg`,
  `/images/icons-cover.jpg`,
  `/images/placeholder-cover.jpg`,
];

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function IconsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold">ðŸ”˜ Icons</h1>

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
          const detailHref = `/products/${encodeURIComponent(slug)}`; // â† single product page

          return (
            <div
              key={String(p.id)}
              className="group overflow-hidden rounded-2xl border bg-white shadow transition hover:shadow-lg"
            >
              {/* Square looks best for icon sets */}
              <HoverableCover srcs={imgCandidates(slug)} alt={p.title} ratio="1/1" fit="contain" />

              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{p.title}</h2>

                {/* Inline â€œMore / Lessâ€ under subtitle (force show) */}
                <InlineMore text={p.description} lines={2} minChars={1} className="mb-2 text-sm text-gray-600" />

                <p className="mb-3 text-lg font-bold">{formatEUR(price)}</p>

                {/* Blue View + Add to Cart (consistent site-wide) */}
                <ShopActions
                  item={{
                    id: slug,
                    title: p.title,
                    price,
                    image: primaryImg,
                    description: p.description,
                  }}
                  viewHref={detailHref}   // â† View â†’ product page
                  goToCartAfterAdd={false}
                />
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}
