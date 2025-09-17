"use client";

import Head from "next/head";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

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

  const formatEUR = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

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

        <CategoryGrid
          items={items}
          renderItem={(p, i) => {
            const id = String(p.id);
            const title = p.title;
            const image = typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg";
            const description = p.description ?? (items[i] as any)?.description ?? "";
            const price =
              typeof p.price === "number"
                ? p.price
                : typeof p.price === "string"
                ? parseFloat(p.price)
                : Number((items[i] as any)?.price ?? 0);

            return (
              <div
                key={id}
                className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
              >
                <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>

                  {/* Inline “More / Less” under subtitle (force show) */}
                  <InlineMore
                    text={description}
                    lines={2}
                    minChars={1}
                    className="text-gray-600 text-sm mb-2"
                  />

                  <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                  {/* keep original fields so checkout/download logic remains intact */}
                  <ShopActions
                    item={{
                      ...(items[i] as any),
                      id,
                      title,
                      image,
                      price,
                      description,
                    }}
                  />
                </div>
              </div>
            );
          }}
        />
      </main>
    </>
  );
}
