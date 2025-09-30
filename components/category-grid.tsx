// components/categories/CategoryGrid.tsx (or your current path)
"use client";

import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";

type Item = {
  id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
  fileUrl?: string;

  // NEW (optional): if provided, we'll URL-encode it to build a safe product href
  slug?: string;
  // NEW (optional): if the caller already computed a URL-safe href, we’ll use it as-is
  href?: string;
};

export default function CategoryGrid({
  heading,
  items,
  ratio = "3/2",
  fit = "contain",
}: {
  heading: string;
  items: Item[];
  ratio?: "16/9" | "3/2" | "1/1";
  fit?: "contain" | "cover";
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">{heading}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => {
          // Build a URL-safe product href if we have a slug; fall back to provided href if any.
          const safeHref =
            item.href ??
            (item.slug ? `/products/${encodeURIComponent(String(item.slug))}` : undefined);

          // Pass the computed href down; harmless if ShopActions doesn't use it.
          const itemForActions = { ...item, href: safeHref };

          return (
            <div
              key={item.id}
              className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
            >
              <HoverableCover src={item.image} alt={item.title} ratio={ratio} fit={fit} />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.description ? (
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                ) : null}
                <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                {/* Blue "View" + "Add to Cart" */}
                <ShopActions item={itemForActions} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
