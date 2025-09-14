// app/categories/marketing-tools/page.tsx
"use client";

import Head from "next/head";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions"; // ⬅️ NEW

export default function MarketingToolsPage() {
  const items = [
    {
      id: "essential-marketing-tools",
      title: "Essential Marketing Tools",
      image: "/images/marketing-tools-cover.jpg",
      price: 6.99,
      description: "Prompts, swipe files & frameworks.",
      fileUrl: "/downloads/essential-marketing-tools.zip",
    },
    {
      id: "email-templates-pack",
      title: "Email Templates Pack",
      image: "/images/email-templates-cover.jpg",
      price: 5.49,
      description: "Proven sequences that convert.",
      fileUrl: "/downloads/email-templates-pack.zip",
    },
    {
      id: "facebook-ad-templates",
      title: "Facebook Ad Templates",
      image: "/images/facebook-ad-templates-cover.jpg",
      price: 5.99,
      description: "Ready-to-run ad creatives & copy.",
      fileUrl: "/downloads/facebook-ad-templates.zip",
    },
  ];

  return (
    <>
      <Head>
        <title>Marketing Tools | Digital Products Artisan</title>
        <meta
          name="description"
          content="Prompts, swipe files, templates and frameworks to grow your brand."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🧾 Marketing Tools</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              <HoverableCover src={item.image} alt={item.title} ratio="3/2" fit="contain" />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold">€{item.price.toFixed(2)}</p>

                {/* ⬇️ The new two-button action bar */}
                <ShopActions item={item} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
