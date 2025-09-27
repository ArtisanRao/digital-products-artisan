// app/products/[slug]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import { products, productsById } from "@/data/products";
import { getPreferredCurrency } from "@/lib/currency";

/* -------------------------- helpers -------------------------- */

function findProduct(idOrSlug: string) {
  const raw = String(idOrSlug ?? "").trim();
  if (!raw) return null;

  // Try numeric id first
  const asNum = Number(raw);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as any)?.[asNum];
    if (byId) return byId;
    const byIdLinear = products.find((p) => Number(p.id) === asNum);
    if (byIdLinear) return byIdLinear;
  }

  // Then try slug (case-insensitive), then string id
  const slugLc = raw.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slugLc) ||
    products.find((p) => String(p.id) === raw) ||
    null
  );
}

function normalizeImages(p: any): string[] {
  const imgs: string[] = Array.isArray(p?.images) && p.images.length
    ? p.images
    : [p?.image].filter(Boolean);

  // Dedupe, keep order
  const seen = new Set<string>();
  const list: string[] = [];
  for (const src of imgs) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    list.push(src);
  }
  return list.length ? list : ["/images/placeholder.jpg"];
}

/* -------------------------- metadata -------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return {};

  const canonical = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;
  const gallery = normalizeImages(p);
  const ogImage = gallery[0] ?? "/images/placeholder.jpg";

  return {
    metadataBase: new URL("https://digitalproductsartisan.com"),
    title: `${p.title} | Digital Products Artisan`,
    description: p.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `https://digitalproductsartisan.com${canonical}`,
      title: `${p.title} | Digital Products Artisan`,
      description: p.description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} | Digital Products Artisan`,
      description: p.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

/* --------------------------- page ---------------------------- */

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const p = findProduct(String(slug ?? ""));
  if (!p) notFound();

  const images = normalizeImages(p);
  const coverImage = images[0];

  const currencyRaw = getPreferredCurrency();
  const currency = String(currencyRaw || "EUR").toUpperCase() as "EUR" | "USD";
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  const priceNumber = typeof p.price === "number" ? p.price : Number(p.price) || 0;
  const priceLabel = new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceNumber);

  // Canonical target for linking title, etc.
  const canonicalHref = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;

  return (
    <main className="product-page mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      {/* Breadcrumbs */}
      <nav className="mb-2 text-sm text-gray-600">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/products" className="hover:underline">Products</Link> <span>›</span>{" "}
        <span aria-current="page">{p.title}</span>
      </nav>

      {/* Gallery (hover zoom via your global CSS) */}
      <section className="hover-zoom relative z-[1]">
        <ProductGallery images={images} alt={p.title} />
      </section>

      {/* Details */}
      <section className="relative z-[2]">
        <h1 className="text-4xl font-extrabold leading-tight">
          <Link
            href={canonicalHref}
            prefetch={false}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">{priceLabel}</div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        {/* Actions: two solid blue buttons, aligned nicely */}
        <div className="mt-6 flex flex-wrap gap-3">
          <AddToCartButton
            id={p.id}
            slug={p.slug as string | undefined}
            title={p.title}
            price={p.price}
            image={coverImage}
            className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          />

          <Button
            asChild
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Link
              href={`/api/checkout?productId=${encodeURIComponent(String(p.id))}&qty=1&currency=${currency}`}
              prefetch={false}
              aria-label={`Buy ${p.title}`}
            >
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            url: `https://digitalproductsartisan.com${canonicalHref}`,
            image: images.map((src) =>
              src.startsWith("http") ? src : `https://digitalproductsartisan.com${src}`
            ),
            description: p.description,
            sku: String(p.id),
            brand: { "@type": "Brand", name: "Digital Products Artisan" },
            offers: {
              "@type": "Offer",
              url: `https://digitalproductsartisan.com${canonicalHref}`,
              priceCurrency: currency,
              price: priceNumber.toFixed(2),
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </main>
  );
}
