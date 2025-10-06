// app/products/best-sellers/page.tsx
import type { Metadata } from "next";
import BestSellersGrid from "./BestSellersGrid";
import { products } from "@/data/products";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalproductsartisan.com"),
  title: "Best-Selling Digital Products | Digital Products Artisan",
  description:
    "Shop our best-selling ebooks, templates, and productivity tools from Digital Products Artisan.",
  alternates: { canonical: "/products/best-sellers" },
  openGraph: {
    title: "Best-Selling Digital Products | Digital Products Artisan",
    url: "https://digitalproductsartisan.com/products/best-sellers",
    type: "website",
    images: [
      { url: "https://digitalproductsartisan.com/images/mastering-chatgpt-for-business-cover.jpg" },
      { url: "https://digitalproductsartisan.com/images/canva-templates-mega-pack-preview.jpg" },
      { url: "https://digitalproductsartisan.com/images/excel-tracker-pro-layouts.jpg" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best-Selling Digital Products | Digital Products Artisan",
  },
  robots: { index: true, follow: true },
};

export const revalidate = 3600;

const CANONICAL_URL = "https://digitalproductsartisan.com/products/best-sellers";

// Pick top sellers by downloads, tie-break by rating
const items = [...products]
  .sort((a, b) => (b.downloads - a.downloads) || (b.rating - a.rating))
  .slice(0, 9)
  .map((p) => ({
    id: p.slug,                 // use slug as stable anchor
    title: p.title,
    image: p.image,
    price: p.price,             // ← sourced from catalog (respects MANUAL_OVERRIDES)
    description: p.description,
  }));

export default function BestSellersPage() {
  // Helper to ensure absolute image URLs for JSON-LD
  const toAbs = (src: string) =>
    src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best-Selling Digital Products",
    url: CANONICAL_URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${CANONICAL_URL}#${encodeURIComponent(it.id)}`,
        item: {
          "@type": "Product",
          name: it.title,
          image: toAbs(it.image),
          description: it.description,
          offers: {
            "@type": "Offer",
            price: it.price.toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🔥 Best-Selling Digital Products</h1>

      {/* Client grid with per-card More/Less + blue actions */}
      <BestSellersGrid items={items} />

      {/* SEO: JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
