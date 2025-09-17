import type { Metadata } from "next";
import BestSellersGrid from "./BestSellersGrid";

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
      { url: "https://digitalproductsartisan.com/products/chatgpt-guide.jpg" },
      { url: "https://digitalproductsartisan.com/products/canva-pack.jpg" },
      { url: "https://digitalproductsartisan.com/products/excel-tracker.jpg" },
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

const items = [
  {
    id: "chatgpt-business",
    title: "Mastering ChatGPT for Business",
    image: "/products/chatgpt-guide.jpg",
    price: 9.99,
    description: "A detailed PDF guide to unlock AI productivity.",
  },
  {
    id: "canva-pack",
    title: "Canva Templates Mega Pack",
    image: "/products/canva-pack.jpg",
    price: 14.99,
    description: "100+ drag-and-drop templates for social media.",
  },
  {
    id: "excel-tracker",
    title: "Excel Tracker Pro",
    image: "/products/excel-tracker.jpg",
    price: 7.99,
    description: "Track expenses, projects, and habits like a pro.",
  },
];

export default function BestSellersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best-Selling Digital Products",
    url: CANONICAL_URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          url: `${CANONICAL_URL}#chatgpt-business`,
          item: {
            "@type": "Product",
            name: "Mastering ChatGPT for Business",
            image: "https://digitalproductsartisan.com/products/chatgpt-guide.jpg",
            description: "A detailed PDF guide to unlock AI productivity.",
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "152" },
            review: [
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                author: { "@type": "Person", name: "Verified buyer" },
              },
            ],
            offers: {
              "@type": "Offer",
              price: "9.99",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          url: `${CANONICAL_URL}#canva-pack`,
          item: {
            "@type": "Product",
            name: "Canva Templates Mega Pack",
            image: "https://digitalproductsartisan.com/products/canva-pack.jpg",
            description: "100+ drag-and-drop templates for social media.",
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: "204" },
            review: [
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                author: { "@type": "Person", name: "Verified buyer" },
              },
            ],
            offers: {
              "@type": "Offer",
              price: "14.99",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          url: `${CANONICAL_URL}#excel-tracker`,
          item: {
            "@type": "Product",
            name: "Excel Tracker Pro",
            image: "https://digitalproductsartisan.com/products/excel-tracker.jpg",
            description: "Track expenses, projects, and habits with an all-in-one spreadsheet.",
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.6", reviewCount: "98" },
            review: [
              {
                "@type": "Review",
                reviewRating: { "@type": "Rating", ratingValue: "5" },
                author: { "@type": "Person", name: "Verified buyer" },
              },
            ],
            offers: {
              "@type": "Offer",
              price: "7.99",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          },
        },
      ],
    },
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🔥 Best-Selling Digital Products</h1>

      {/* Client grid with expander + actions */}
      <BestSellersGrid items={items} />

      {/* SEO: JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
