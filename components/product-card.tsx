'use client';

import Image from 'next/image';
import * as React from 'react';
import { Eye } from 'lucide-react';
import ProductQuickView from '@/components/product-quick-view';
import { Button } from '@/components/ui/button';

type Product = {
  id: number | string;
  title: string;
  slug: string;
  image?: string | null;    // absolute URL or /images/... or undefined
  description?: string;
  longDescription?: string; // <- use this when present
  price: number;
  images?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  // Compute a safe initial src and fallbacks
  const computeSrc = () => {
    if (product.image && product.image.startsWith('http')) return product.image;
    if (product.image && product.image.startsWith('/')) return product.image;
    // slug-based local default (place a file at /public/images/products/<slug>/cover.jpg)
    return `/images/products/${product.slug}/cover.jpg`;
  };

  const [src, setSrc] = React.useState<string>(computeSrc());
  const [open, setOpen] = React.useState(false);

  // --- Read more / Show less state ---
  const [expanded, setExpanded] = React.useState(false);
  const fullText =
    (product.longDescription ?? product.description ?? '').trim();
  const MAX_CHARS = 120;
  const needsToggle = fullText.length > MAX_CHARS;
  const preview = needsToggle
    ? fullText.slice(0, MAX_CHARS).trimEnd() + '…'
    : fullText;

  const openQuickView = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border bg-white">
        {/* IMAGE (clickable for quick view) */}
        <div className="relative aspect-[3/4] w-full bg-gray-100">
          <Image
            src={src}
            alt={product.title}
            fill
            sizes="(min-width:1280px) 280px, (min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setSrc('/images/placeholder-cover.jpg')} // ensure this file exists
            priority={false}
            onClick={openQuickView}
          />

          {/* floating quick-view trigger */}
          <button
            onClick={openQuickView}
            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white focus:outline-none"
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* title + View button */}
        <div className="flex items-start justify-between gap-3 p-4">
          <h3 className="line-clamp-2 font-semibold text-gray-900">{product.title}</h3>

          <Button
            size="sm"
            variant="secondary"
            className="shrink-0"
            onClick={openQuickView}
            aria-label={`View ${product.title}`}
          >
            View
          </Button>
        </div>

        {/* clamped description (separate row to avoid layout shifts) */}
        {fullText && (
          <div className="px-4 pb-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {expanded ? fullText : preview}
            </p>

            {needsToggle && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-sm font-medium text-blue-700 hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? 'Show less' : 'More'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick-View modal */}
      <ProductQuickView product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}
