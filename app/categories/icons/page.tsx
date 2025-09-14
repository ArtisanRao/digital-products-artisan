// app/categories/icons/page.tsx
"use client";

import Head from "next/head";
import HoverableCover from "@/components/ui/hoverable-cover";

function buildFallbacksFrom(src: string) {
  // src like "/images/icons/ui-icon-pack-cover.jpg"
  const parts = src.split(".");
  const ext = parts.pop() || "jpg";
  const noExt = parts.join(".");
  const exts = ["jpg", "png", "jpeg", "JPG", "PNG", "JPEG"];

  // base variants: with/without "-cover", also "/cover"
  const noCover = noExt.replace(/-cover$/i, "");
  const asFolder = `${noCover}/cover`;

  const bases = Array.from(new Set([noExt, noCover, asFolder]));

  // icons vs Icons (case on folder)
  const caseSwaps = bases.flatMap((b) => {
    if (b.startsWith("/images/icons/")) {
      return [b, b.replace("/images/icons/", "/images/Icons/")];
    }
    return [b];
  });

  // expand with all extensions
  const withExts: string[] = [];
  for (const b of caseSwaps) {
    for (const e of exts) withExts.push(`${b}.${e}`);
  }

  // remove the original src if present (it will be primary)
  return Array.from(new Set(withExts.filter((p) => p !== src)));
}

export default function IconsPage() {
  const items = [
    {
      id: "ui-icon-pack",
      title: "UI Icon Pack",
      image: "/images/icons/ui-icon-pack-cover.jpg",
      price: 4.99,
      description: "500 crisp UI icons in SVG + PNG.",
      fileUrl: "/downloads/ui-icon-pack.zip",
    },
    {
      id: "minimal-icons",
      title: "Minimal Icons",
      image: "/images/icons/minimal-icons-cover.jpg",
      price: 3.99,
      description: "Clean, thin-line icons great for dashboards.",
      fileUrl: "/downloads/minimal-icons.zip",
    },
    {
      id: "gradient-icons",
      title: "Gradient Icons",
      image: "/images/icons/gradient-icons-cover.jpg",
      price: 5.49,
      description: "Vibrant, modern gradient-styled icons.",
      fileUrl: "/downloads/gradient-icons.zip",
    },
  ];

  const structuredData = items.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: `https://digitalproductsartisan.com${p.image}`,
    description: p.description,
    sku: p.id,
    offers: {
      "@type": "Offer",
      url: "https://digitalproductsartisan.com/categories/icons",
      priceCurrency: "EUR",
      price: p.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  }));

  return (
    <>
      <Head>
        <title>Icons | Digital Products Artisan</title>
        <meta
          name="description"
          content="Premium icon packs for apps, dashboards, and websites."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🔘 Icons</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              <HoverableCover
                src={item.image}
                fallbacks={buildFallbacksFrom(item.image)}
                alt={item.title}
                ratio="1/1"
                fit="contain"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                <button
                  className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  data-item-id={item.id}
                  data-item-name={item.title}
                  data-item-price={item.price}
                  data-item-url="/categories/icons"
                  data-item-description={item.description}
                  data-item-image={item.image}
                  data-item-file-guid={item.fileUrl}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
