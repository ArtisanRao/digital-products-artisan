// app/products/[slug]/page.tsx
"use client";

import Image from "next/image";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
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

  // Local Buy handler (opens Stripe Checkout via /api/checkout)
  const handleBuy = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: slug, qty: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {
      // optional: toast an error
    }
  };

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

        <div className="mt-6 flex flex-wrap gap-3">
          {/* BUY — opens Stripe Checkout (always visible here) */}
          <Button
            type="button"
            onClick={handleBuy}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Buy
          </Button>

          {/* ShopActions (View + Add to cart; Buy can be enabled there too if desired) */}
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
