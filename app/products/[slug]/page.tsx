// app/products/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";
import { products, productsById } from "@/data/products";
import { getPreferredCurrency } from "@/lib/currency";

// ✅ Correct location for your client gallery component
import ProductGallery from "../_components/ProductGallery";

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

// In Next.js 15, `params` is a Promise — await it here.
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const p = findProduct(String(slug ?? ""));

  if (!p) notFound();

  const imgs: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];

  const currencyRaw = getPreferredCurrency();
  const currency = String(currencyRaw).toUpperCase() as "EUR" | "USD";
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  const display = new Intl.NumberFormat(locale, { style: "currency", currency }).format(p.price);

  const canonicalHref = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <section style={{ zIndex: 1, position: "relative" }}>
        <ProductGallery images={imgs} alt={p.title} />
      </section>

      <section className="isolate" style={{ position: "relative", zIndex: 60, pointerEvents: "auto" }}>
        <h1
          className="text-4xl font-extrabold leading-tight"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Link
            href={canonicalHref}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">{display}</div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div
          className="mt-6 flex flex-wrap gap-3"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <AddToCartButton
            productId={p.id}
            className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          />

          {/* Keep a simple link Buy fallback (your client Buy button can still exist elsewhere) */}
          <Button
            asChild
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Link href={`/api/checkout?productId=${encodeURIComponent(String(p.id))}&qty=1&currency=${currency}`}>
              Buy
            </Link>
          </Button>
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
