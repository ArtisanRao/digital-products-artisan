"use client";

import Head from "next/head";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

export default function PromptPacksAndAIToolsPage() {
  const items = [
    {
      id: "essential-marketing-prompts",
      title: "Essential Marketing Prompts",
      image: "/images/marketing-tools-cover.jpg",
      price: 6.99,
      description: "High-converting prompts for ads, emails & landing pages.",
      fileUrl: "/downloads/essential-marketing-tools.zip",
    },
    {
      id: "email-prompts-pack",
      title: "Email Prompts Pack",
      image: "/images/email-templates-cover.jpg",
      price: 5.49,
      description: "Sequences for welcome, nurture, launches & promos.",
      fileUrl: "/downloads/email-templates-pack.zip",
    },
    {
      id: "facebook-ads-prompt-studio",
      title: "Facebook Ads Prompt Studio",
      image: "/images/facebook-ad-templates-cover.jpg",
      price: 5.99,
      description: "Creative & copy prompts for cold, warm, and remarketing.",
      fileUrl: "/downloads/facebook-ad-templates.zip",
    },
  ];

  const formatEUR = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

  return (
    <>
      <Head>
        <title>Prompt Packs & AI Tools | Digital Products Artisan</title>
        <meta
          name="description"
          content="Curated prompt packs, automations, and AI utilities to speed up writing, research, marketing and more."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🧠 Prompt Packs & AI Tools</h1>

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
