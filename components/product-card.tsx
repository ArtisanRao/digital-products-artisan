// components/product-card.tsx
import Image from "next/image";
import * as React from "react";

type Product = {
  id: string;
  title: string;
  slug: string;
  image?: string | null; // absolute URL or /images/... or undefined
  // ...other fields
};

export default function ProductCard({ product }: { product: Product }) {
  // Compute a safe initial src and fallbacks
  const computeSrc = () => {
    if (product.image && product.image.startsWith("http")) return product.image;
    if (product.image && product.image.startsWith("/")) return product.image;
    // slug-based local default (place a file at /public/images/products/<slug>/cover.jpg)
    return `/images/products/${product.slug}/cover.jpg`;
  };

  const [src, setSrc] = React.useState<string>(computeSrc());

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white">
      {/* IMAGE */}
      <div className="relative aspect-[3/4] w-full bg-gray-100">
        <Image
          src={src}
          alt={product.title}
          fill
          sizes="(min-width:1280px) 280px, (min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setSrc("/images/placeholder-cover.jpg")} // put this file in /public/images/
          priority={false}
        />
      </div>

      {/* ...rest of the card (badges, title, price, etc.) */}
    </div>
  );
}
