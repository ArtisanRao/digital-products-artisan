// components/product-card.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import ReadMore from "@/components/read-more";
import ProductQuickView from "@/components/product-quick-view";

type Product = {
  id: string;                 // numeric string ok
  title: string;
  slug: string;
  image?: string | null;      // absolute URL or /images/...
  images?: string[];          // optional gallery
  description?: string;       // optional long copy
  price?: number;             // optional (for quick view CTA)
  // ...other fields
};

export default function ProductCard({ product }: { product: Product }) {
  // Compute a safe primary image (prefer gallery[0], then image, then slug-based default)
  const computeSrc = () => {
    const galleryFirst =
      Array.isArray(product.images) && product.images.length
        ? product.images[0]
        : null;

    const candidate = galleryFirst ?? product.image ?? "";
    if (candidate && candidate.startsWith("http")) return candidate;
    if (candidate && candidate.startsWith("/")) return candidate;

    // slug-based local default (ensure file exists)
    return `/images/products/${product.slug}/cover.jpg`;
  };

  const [src, setSrc] = React.useState<string>(computeSrc());

  // Prepare minimal data for the quick view dialog
  const quickViewData = {
    id: Number(product.id) || 0,
    title: product.title,
    description: product.description ?? "",
    price: typeof product.price === "number" ? product.price : 0,
    image: src,
    images: product.images,
  };

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`} className="relative block aspect-[3/4] w-full bg-gray-100">
        <Image
          src={src}
          alt={product.title}
          fill
          sizes="(min-width:1280px) 280px, (min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setSrc("/images/placeholder-cover.jpg")} // place this in /public/images/
          priority={false}
        />
      </Link>

      {/* BODY */}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-semibold leading-snug">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>

        {/* Short description preview with toggle */}
        {product.description && (
          <ReadMore text={product.description} lines={2} className="mt-1" />
        )}

        {/* Actions: keep your existing buttons where you render them;
           add a quick 'Full description' modal trigger here */}
        <div className="mt-3 flex items-center gap-3">
          <Link
            href={`/products/${product.id}`}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            View
          </Link>

          <ProductQuickView product={quickViewData}>
            <span className="text-sm">Full description</span>
          </ProductQuickView>
        </div>
      </div>
    </div>
  );
}
