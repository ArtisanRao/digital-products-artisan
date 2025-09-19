// app/products/[slug]/page.tsx
"use client";

import Image from "next/image";
import InlineMore from "@/components/ui/inline-more";
import ShopActions from "@/components/shop-actions";

// TODO: replace with your real data source
const PRODUCTS: Record<
  string,
  { title: string; price: number; images: string[]; description: string }
> = {
  "1": {
    title: "Buy This Complete Shop – PLR MRR Digital Product",
    price: 42.99,
    images: [
      "/images/complete-shop-1.jpg",
      "/images/complete-shop-2.jpg",
      "/images/complete-shop-3.jpg",
    ],
    description:
      "Buy my complete shop with PLR / MRR rights. You’ll get courses, ebooks, prompts and more. Full license & updates included.",
  },
};

type Params = { slug: string };

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = PRODUCTS[slug];

  if (!p) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.2fr_.8fr] gap-8">
      {/* Left: gallery */}
      <section className="space-y-4">
        <div className="relative aspect-[4/3] rounded-xl border overflow-hidden bg-white">
          <Image
            src={p.images[0]}
            alt={p.title}
            fill
            priority
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-contain"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {p.images.slice(1).map((src) => (
            <div
              key={src}
              className="relative aspect-[4/3] rounded-lg border overflow-hidden bg-white"
            >
              <Image
                src={src}
                alt={p.title}
                fill
                sizes="33vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Right: info */}
      <section>
        <h1 className="text-3xl font-bold">{p.title}</h1>
        <div className="mt-2 text-2xl font-semibold">€{p.price.toFixed(2)}</div>

        <div className="mt-3 text-gray-700">
          <InlineMore text={p.description} lines={3} minChars={80} />
        </div>

        <div className="mt-6 flex gap-3">
          {/* ShopActions now renders:
              - View (blue)
              - Buy (opens Stripe Checkout)
              - Add to cart (stays put) */}
          <ShopActions
            item={{
              id: slug,
              title: p.title,
              price: p.price,
              image: p.images[0],
              description: p.description,
            }}
            viewHref={`/products/${slug}`}
            goToCartAfterAdd={false}
            buyEnabled
            buyLabel="Buy"
          />
        </div>

        <ul className="mt-6 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Instant download after purchase</li>
          <li>PLR / MRR license included (where stated)</li>
          <li>Secure checkout via Stripe</li>
        </ul>
      </section>
    </main>
  );
}
