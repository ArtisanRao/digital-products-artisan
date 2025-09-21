'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AddToCartButton from '@/components/add-to-cart-button';

type Product = {
  id: number | string;
  title: string;
  slug: string;
  description?: string;
  longDescription?: string; // âœ… prefer this when present
  price: number;
  image?: string | null;
  images?: string[];
};

type Props = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProductQuickView({ product, open, onOpenChange }: Props) {
  const images = (product.images?.length ? product.images : [product.image]).filter(
    Boolean
  ) as string[];
  const cover = images[0] ?? '/images/placeholder-cover.jpg';

  // Prefer longDescription, then description, otherwise empty string
  const desc = (product.longDescription?.trim() || product.description?.trim() || '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(900px,96vw)] p-0 overflow-hidden">
        {/* close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Close quick view"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* media */}
          <div className="relative bg-gray-50">
            <Image
              src={cover}
              alt={product.title}
              width={900}
              height={900}
              className="h-full w-full object-contain"
              priority={false}
            />
          </div>

          {/* details */}
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-xl md:text-2xl font-bold">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* price */}
            <div className="mb-4 text-2xl font-semibold">
              â‚¬{product.price.toFixed(2)}
            </div>

            {/* long description (scrollable if very long). 
                whitespace-pre-line preserves your line breaks from data/products.ts */}
            <div className="max-h-56 overflow-auto pr-2">
              {desc ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {desc}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No description provided.</p>
              )}
            </div>

            {/* actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton productId={Number(product.id)} />
              <Button variant="outline" asChild>
                <Link href={`/products/${product.id}`}>View full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
