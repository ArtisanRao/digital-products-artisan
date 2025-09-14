// app/categories/icons/page.tsx
"use client";

import Head from "next/head";
import HoverableCover from "@/components/ui/hoverable-cover";

function buildIconCandidates(base: string) {
  // try multiple name patterns + case variants
  const exts = ["jpg", "png", "jpeg"];
  const cands: string[] = [];

  // /images/icons/<name>
  for (const e of exts) cands.push(`${base}.${e}`);
  for (const e of exts) cands.push(`${base}-cover.${e}`);
  for (const e of exts) cands.push(`${base}/cover.${e}`);

  // /images/Icons/<name> (case)
  const upper = base.replace("/images/icons/", "/images/Icons/");
  if (upper !== base) {
    for (const e of exts) cands.push(`${upper}.${e}`);
    for (const e of exts) cands.push(`${upper}-cover.${e}`);
    for (const e of exts) cands.push(`${upper}/cover.${e}`);
  }

  // /images/<name> as a last resort
  const short = base.replace("/images/icons/", "/images/");
  if (short !== base) {
    for (const e of exts) cands.push(`${short}-cover.${e}`);
    for (const e of exts) cands.push(`${short}/cover.${e}`);
    for (const e of exts) cands.push(`${short}.${e}`);
  }

  // unique
  return Array.from(new Set(cands));
}

export default function IconsPage() {
  const items = [
    {
      id: "ui-icon-pack",
      title: "UI Icon Pack",
      base: "/images/icons/ui-icon-pack",
      price: 4.99,
      description: "500 crisp UI icons in SVG + PNG.",
      fileUrl: "/downloads/ui-icon-pack.zip",
    },
    {
      id: "minimal-icons",
      title: "Minimal Icons",
      base: "/images/icons/minimal-icons",
      price: 3.99,
      description: "Clean, thin-line icons great for dashboards.",
      fileUrl: "/downloads/minimal-icons.zip",
    },
    {
      id: "gradient-icons",
      title: "Gradient Icons",
      base: "/images/icons/gradient-icons",
      price: 5.49,
      description: "Vibrant, modern gradient-styled icons.",
      fileUrl: "/downloads/gradient-icons.zip",
    },
  ];

  const structuredData = items.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: `https://digitalproductsartisan.com${p.base}.jpg`,
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
          {items.map((item) => {
            const fallbacks = buildIconCandidates(item.base);
            const [first, ...rest] = fallbacks;

            return (
              <div
                key={item.id}
                className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
              >
                <HoverableCover
                  src={first ?? "/images/placeholder-cover.jpg"}
                  fallbacks={rest}
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
                    data-item-image={first ?? "/images/placeholder-cover.jpg"}
                    data-item-file-guid={item.fileUrl}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
