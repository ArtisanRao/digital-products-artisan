// app/products/[slug]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";

// You can replace this with your actual product store / CMS
const PRODUCTS: Record<string, {
  title: string;
  price: number;               // EUR
  images: string[];
  description: string;
}> = {
  "buy-this-complete-shop": {
    title: "Buy This Complete Shop – PLR MRR",
    price: 42.99,
    images: [
      "/images/complete-shop-1.jpg",
      "/images/complete-shop-2.jpg",
      "/images/complete-shop-3.jpg",
    ],
    description:
      "Buy my complete shop with PLR/MRR rights. You’ll get courses, ebooks, prompts and more. Full license & updates included.",
  },
  // ...other products
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug;
  const p = PRODUCTS[slug];

  if (!p) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const buy = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        quantity: 1,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url; // redirect to Stripe Checkout
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1.2fr_.8fr] gap-8">
      {/* Left: gallery */}
      <section className="space-y-4">
        <div className="relative aspect-[4/3] rounded-xl border overflow-hidden bg-white">
          <Image src={p.images[0]} alt={p.title} fill priority sizes="(min-width:1024px) 60vw, 100vw" className="object-contain" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {p.images.slice(1).map((src) => (
            <div key={src} className="relative aspect-[4/3] rounded-lg border overflow-hidden bg-white">
              <Image src={src} alt={p.title} fill sizes="33vw" className="object-contain" />
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
          <Button
            onClick={buy}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Buy now
          </Button>

          {/* Optional: add-to-cart stays on page (uses your existing local cart) */}
          {/* You can also render <ShopActions item={...} viewHref={`/products/${slug}`} /> here */}
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
