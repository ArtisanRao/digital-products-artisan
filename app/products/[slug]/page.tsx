"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import ShopActions from "@/components/shop-actions";
import ProductGallery from "@/components/ProductGallery";
import { products, productsById } from "@/data/products";

function findProduct(idOrSlug: string) {
  const asNum = Number(idOrSlug);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as any)?.[asNum];
    if (byId) return byId;
    const byIdLinear = products.find((p) => Number(p.id) === asNum);
    if (byIdLinear) return byIdLinear;
  }
  const slug = idOrSlug.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slug) ||
    products.find((p) => String(p.id) === idOrSlug) ||
    null
  );
}

export default function ProductPageBySlug() {
  const params = useParams<{ slug: string }>();
  const handle = String(params?.slug ?? "");
  const p = findProduct(handle);

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12" data-page="product">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const imgs: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];
  const cover = imgs[0] ?? "/images/placeholder-cover.jpg";

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p.id, qty: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <main
      className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]"
      data-page="product"
    >
      {/* LEFT: gallery stays in base layer */}
      <section className="relative z-0">
        <ProductGallery images={imgs} alt={p.title} />
      </section>

      {/* RIGHT: raise layer + explicitly allow clicks */}
      <section className="relative z-[60] pointer-events-auto isolate">
        <h1 className="relative z-[61] text-4xl font-extrabold leading-tight">
          <Link
            href={`/products/${encodeURIComponent(String(p.id))}`}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.price)}
        </div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div className="relative z-[61] mt-6 flex flex-wrap gap-3 pointer-events-auto">
          <Button
            type="button"
            onClick={handleBuy}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ pointerEvents: "auto" }}
          >
            Buy
          </Button>

          <ShopActions
            item={{ id: String(p.id), title: p.title, price: p.price, image: cover, description: p.description }}
            viewHref={`/products/${encodeURIComponent(String(p.id))}`}
            goToCartAfterAdd={false}
            buyEnabled={false}
          />
        </div>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>Instant download after purchase</li>
          <li>PLR / MRR license included (where stated)</li>
          <li>Secure checkout via Stripe</li>
        </ul>
      </section>
    </main>
  );
}
