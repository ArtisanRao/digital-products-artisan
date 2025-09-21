"use client";

import * as React from "react";
import ProductActions from "@/components/ProductActions";
type Item = {
  id: number | string;
  title: string;
  price: number;
  image?: string;
  description?: string;
};

/**
 * TEMP data to unblock build.
 * Replace `demoItems` with your real data source when ready.
 */
const demoItems: Item[] = [
  { id: 101, title: "Quickstart: ChatGPT Prompts", price: 9 },
  { id: 102, title: "Advanced AI Workflows", price: 19 },
  { id: 103, title: "Prompt Engineering Cookbook", price: 29 },
];

export default function Page() {
  const items = demoItems;

  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-10 text-center text-4xl font-bold">🤖 AI &amp; ChatGPT Guides</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const slug = String(p.id); // replace with p.slug ?? String(p.id) when real data has a slug
          const detailHref = `/products/${slug}`;
          const item: Item = {
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image,
            description: p.description,
          };

          return (
            <div key={slug} className="flex flex-col rounded-lg border p-4">
              <a href={detailHref} className="mb-3 font-semibold hover:underline">
                {p.title}
              </a>

              <div className="mt-auto">
                <ProductActions
                  {...({
                    item,
                    viewHref: detailHref,
                    goToCartAfterAdd: false,
                    buyEnabled: false, // slugs here are not product IDs, so disable direct Buy
                  } as import("@/components/ProductActions").Props)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}


