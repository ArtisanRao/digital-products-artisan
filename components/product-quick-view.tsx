'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddToCartButton from '@/components/add-to-cart-button';

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
};

export default function ProductQuickView({
  product,
  triggerClassName = 'text-blue-600 hover:underline',
  children, // optional custom trigger content
}: {
  product: Product;
  triggerClassName?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const firstImage =
    (product.images && product.images[0]) || product.image || '/placeholder.svg';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
        aria-haspopup="dialog"
      >
        {children ?? 'Full description'}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-3xl w-[95vw] p-0 overflow-hidden"
          aria-describedby={undefined}
        >
          <div className="relative bg-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center rounded-full w-9 h-9 bg-black/80 text-white hover:bg-black"
              aria-label="Close"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-square bg-white">
                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <div className="mt-2 text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    €{product.price.toFixed(2)}
                  </span>
                  <AddToCartButton
                    productId={product.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  />
                </div>

                <div className="mt-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm text-gray-700 underline underline-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    View full product page →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
