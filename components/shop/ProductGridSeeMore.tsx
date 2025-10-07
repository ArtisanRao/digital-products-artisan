"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProductCardV4 from "@/components/shop/ProductCardV4";
import type { Product } from "@/data/products";
import { productPath } from "@/data/products";

type Props = {
  items: Product[];
  /** How many to show initially */
  initial?: number;
  /** How many to add/remove per click */
  step?: number;
  /** Optional extra classes for the grid */
  gridClassName?: string;
};

export default function ProductGridSeeMore({
  items,
  initial = 12,
  step = 12,
  gridClassName = "",
}: Props) {
  const total = items.length;
  const safeInitial = Math.min(Math.max(1, initial), Math.max(1, total));
  const [visible, setVisible] = useState<number>(safeInitial);

  const canShowMore = visible < total;
  const canShowLess = visible > safeInitial;

  const slice = useMemo(() => items.slice(0, visible), [items, visible]);

  const toCard = (p: Product) => {
    const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      images: images.slice(0, 4),
      description: p.description,
      href: productPath(p),
    };
  };

  return (
    <div data-ui="ProductGridSeeMore@v1">
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${gridClassName}`}
      >
        {slice.map((p) => (
          <ProductCardV4 key={`all:${p.slug}`} {...toCard(p)} />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="text-sm text-gray-600">
          Showing <strong>{Math.min(visible, total)}</strong> of <strong>{total}</strong>
        </span>

        {canShowLess && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setVisible((n) => Math.max(safeInitial, n - step))}
            aria-label="See less products"
            title="See less products"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            See less products
          </Button>
        )}

        {canShowMore && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setVisible((n) => Math.min(total, n + step))}
            aria-label="See more products"
            title="See more products"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            See more products
          </Button>
        )}
      </div>
    </div>
  );
}
