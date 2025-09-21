"use client";

import Head from "next/head";
import CategoryGrid from "@/components/categories/CategoryGrid";
import HoverableCover from "@/components/ui/hoverable-cover";
import ShopActions from "@/components/shop-actions";
import InlineMore from "@/components/ui/inline-more";

export default function EbooksPage() {
  const ebooks = [
    {
      id: "50-powerful-prompts",
      title: "50 Powerful Prompts",
      image: "/images/50-powerful-prompts-cover.jpg",
      price: 5.99,
      description: "Supercharge your creativity with 50 AI-ready prompts.",
      fileUrl: "/downloads/50-powerful-prompts.pdf",
    },
    {
      id: "50-prompts-notion",
      title: "50 Prompts (Notion Format)",
      image: "/images/50-powerful-prompts-notion-format-cover.jpg",
      price: 5.99,
      description: "Same prompts, fully organized in Notion.",
      fileUrl: "/downloads/50-powerful-prompts-notion.pdf",
    },
    {
      id: "fantasy-novel",
      title: "The Lost Realm â€“ A Fantasy Novel",
      image: "/images/fantasy-novel-cover.jpg",
      price: 6.49,
      description: "An epic journey through a magical world of dragons and destiny.",
      fileUrl: "/downloads/fantasy-novel.pdf",
    },
    {
      id: "science-fiction-novel",
      title: "Galactic Echoes â€“ Sci-Fi Thriller",
      image: "/images/science-fiction-novel-cover.jpg",
      price: 6.99,
      description: "A suspenseful journey through space and time.",
      fileUrl: "/downloads/science-fiction-novel.pdf",
    },
    {
      id: "romance-novel",
      title: "Love Letters â€“ Romance Novel",
      image: "/images/romance-novel-cover.jpg",
      price: 5.49,
      description: "A heartwarming love story to escape into.",
      fileUrl: "/downloads/romance-novel.pdf",
    },
    {
      id: "self-help-book",
      title: "Unlock You â€“ Self-Help Book",
      image: "/images/self-help-personal-development-book-cover.jpg",
      price: 7.25,
      description: "Practical wisdom to improve your life and mindset.",
      fileUrl: "/downloads/self-help-book.pdf",
    },
    {
      id: "the-code-of-success",
      title: "The Code of Success",
      image: "/images/the-code-of-success-cover.jpg",
      price: 8.49,
      description: "A strategic guide for achieving success in any field.",
      fileUrl: "/downloads/the-code-of-success.pdf",
    },
    {
      id: "true-crime-novel",
      title: "Whispers of Guilt â€“ True Crime",
      image: "/images/true-crime-novel-cover.jpg",
      price: 5.95,
      description: "A chilling exploration of real-life mystery and justice.",
      fileUrl: "/downloads/true-crime.pdf",
    },
  ];

  const structuredData = ebooks.map((ebook) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: ebook.title,
    image: `https://digitalproductsartisan.com${ebook.image}`,
    description: ebook.description,
    sku: ebook.id,
    offers: {
      "@type": "Offer",
      url: `https://digitalproductsartisan.com/categories/ebooks`,
      priceCurrency: "EUR",
      price: ebook.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  }));

  const formatEUR = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

  return (
    <>
      <Head>
        <title>eBooks Collection | Digital Products Artisan</title>
        <meta
          name="description"
          content="Browse our premium collection of downloadable eBooks across genres â€” fantasy, self-help, sci-fi and more."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">ðŸ“š eBooks Collection</h1>

        <CategoryGrid
          items={ebooks}
          renderItem={(p, i) => {
            const id = String(p.id);
            const title = p.title;
            const image = typeof p.image === "string" ? p.image : "/images/placeholder-cover.jpg";
            const description = p.description ?? (ebooks[i] as any)?.description ?? "";
            const price =
              typeof p.price === "number"
                ? p.price
                : typeof p.price === "string"
                ? parseFloat(p.price)
                : Number((ebooks[i] as any)?.price ?? 0);

            return (
              <div
                key={id}
                className="group rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg"
              >
                <HoverableCover src={image} alt={title} ratio="3/2" fit="contain" />

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>

                  {/* Inline â€œMore / Lessâ€ under subtitle */}
                  <InlineMore
                    text={description}
                    lines={1}
                    minChars={40}
                    className="text-gray-600 text-sm mb-2"
                  />

                  <p className="text-lg font-bold mb-3">{formatEUR(price)}</p>

                  <ShopActions
                    item={{
                      ...(ebooks[i] as any),
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
