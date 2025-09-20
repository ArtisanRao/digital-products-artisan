'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Eye } from 'lucide-react';
import ProductQuickView from '@/components/product-quick-view';
import { Button } from '@/components/ui/button';
import ShopActions from '@/components/shop-actions';
import { productsById, productsBySlug } from '@/data/products';

type Product = {
  id: number | string;
  title: string;
  slug: string;
  image?: string | null;
  description?: string;
  longDescription?: string;
  price: number;
  images?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  // Hydrate from your catalog (longDescription, images, etc.)
  const hydrated = React.useMemo(() => {
    const byId =
      typeof product.id === 'number'
        ? productsById[product.id]
        : productsById[Number(product.id)];
    const bySlug = productsBySlug[product.slug];
    return byId ?? bySlug ?? (product as any);
  }, [product.id, product.slug]);

  // Prefer numeric ID route if available; otherwise fall back to slug
  const numericLike = /^\d+$/.test(String(product.id));
  const idPart = numericLike ? String(product.id) : product.slug;
  const productHref = `/products/${encodeURIComponent(idPart)}`;

  const fullTextRaw =
    (hydrated.longDescription as string | undefined) ??
    (hydrated.description as string | undefined) ??
    '';
  const fullText = fullTextRaw.trim();

  const MAX_CHARS = 90;
  const needsToggle = fullText.length > MAX_CHARS;
  const preview = needsToggle ? fullText.slice(0, MAX_CHARS).trimEnd() + '…' : fullText;

  // Image src with fallbacks
  const computeSrc = () => {
    if (product.image && product.image.startsWith('http')) return product.image;
    if (product.image && product.image.startsWith('/')) return product.image;
    return `/images/products/${product.slug}/cover.jpg`;
  };
  const [src, setSrc] = React.useState<string>(computeSrc());
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

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
            onError={() => setSrc('/images/placeholder-cover.jpg')}
            priority={false}
            onClick={openQuickView}
          />
          <button
            onClick={openQuickView}
            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow hover:bg-white focus:outline-none"
            aria-label="Quick view"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* Title + View (both go to full product page) */}
        <div className="flex items-start justify-between gap-3 p-4">
          <h3 className="line-clamp-2 font-semibold text-gray-900">
            <Link href={productHref} className="hover:text-blue-600">
              {product.title}
            </Link>
          </h3>

          {/* View → product page (not quick view) */}
          <Button size="sm" variant="secondary" className="shrink-0" asChild>
            <Link href={productHref} aria-label={`View ${product.title}`}>
              View
            </Link>
          </Button>
        </div>

        {/* Description with “More / Show less” */}
        {fullText && (
          <div className="px-4 pb-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {expanded ? fullText : preview}
            </p>
            {needsToggle && (
              <button
                type="button"
                onClick={() => setExpanded(v => !v)}
                className="mt-1 text-sm font-medium text-blue-700 hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? 'Show less' : 'More'}
              </button>
            )}
          </div>
        )}

        {/* Actions: Buy (Stripe) + Add to cart (badge) + View already above */}
        <div className="px-4 pb-4">
          <ShopActions
            item={{
              id: product.id,
              title: product.title,
              price: hydrated.price ?? product.price,
              image: hydrated.images?.[0] ?? product.image ?? src,
              description: hydrated.description ?? product.description,
            }}
            viewHref={productHref}        // “View” inside ShopActions also goes to details page
            goToCartAfterAdd={false}      // stay put; badge updates via events/localStorage
            buyEnabled                     // show Buy button that opens Stripe Checkout
            buyLabel="Buy"
          />
        </div>
      </div>

      {/* Quick View modal stays available via top-right eye button */}
      <ProductQuickView product={hydrated} open={open} onOpenChange={setOpen} />
    </>
  );
}
