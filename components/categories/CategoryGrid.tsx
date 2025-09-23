"use client";

import { useEffect, useMemo, useState, Fragment } from "react";

/** Minimal product shape this grid needs. Extend as you like. */
export type Product = {
  id: string | number;
  title: string;
  slug?: string;
  price?: number | string;
  image?: string;
  description?: string; // ← added
};

/** Resilient <img> that tries multiple candidate sources in order */
function SafeThumb({
  product,
  className,
  alt,
}: {
  product: Product;
  className?: string;
  alt?: string;
}) {
  const candidates = useMemo(() => {
    const list: string[] = [];

    // 1) explicit image (and its extension variants)
    if (product.image) {
      const src = product.image;
      list.push(src);
      if (/\.jpe?g$/i.test(src)) {
        list.push(src.replace(/\.jpe?g$/i, ".png"));
        list.push(src.replace(/\.jpe?g$/i, ".webp"));
      } else if (/\.png$/i.test(src)) {
        list.push(src.replace(/\.png$/i, ".jpg"));
        list.push(src.replace(/\.png$/i, ".webp"));
      } else if (/\.webp$/i.test(src)) {
        list.push(src.replace(/\.webp$/i, ".jpg"));
        list.push(src.replace(/\.webp$/i, ".png"));
      }
    }

    // 2) category defaults based on slug
    if (product.slug) {
      list.push(`/images/categories/${product.slug}/card.jpg`);
      list.push(`/images/categories/${product.slug}/card.png`);
      list.push(`/images/categories/${product.slug}/card.webp`);

      // 3) product defaults based on slug
      list.push(`/images/products/${product.slug}/cover.jpg`);
      list.push(`/images/products/${product.slug}/cover.png`);
      list.push(`/images/products/${product.slug}/cover.webp`);
    }

    // 4) global fallbacks
    list.push("/images/categories/_default/card.jpg");
    list.push("/images/placeholder.jpg");

    // Deduplicate while preserving order
    return Array.from(new Set(list));
  }, [product.image, product.slug]);

  const [idx, setIdx] = useState(0);

  // Reset to first candidate if product changes
  useEffect(() => setIdx(0), [product.id, product.image, product.slug]);

  // If we run out of candidates entirely, render nothing
  if (!candidates.length) return null;

  return (
    <img
      src={candidates[idx]}
      alt={alt ?? product.title}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}

/** Default card (used only if you don't pass a custom renderer) */
function DefaultProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border bg-white/50 p-4 shadow-sm transition hover:shadow">
      <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl">
        <SafeThumb
          product={product}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
      {product.price !== undefined && (
        <p className="mt-1 text-xs text-muted-foreground">From {String(product.price)}</p>
      )}
    </article>
  );
}

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("base");
  useEffect(() => {
    const q = {
      xl: window.matchMedia("(min-width: 1280px)"),
      lg: window.matchMedia("(min-width: 1024px)"),
      md: window.matchMedia("(min-width: 768px)"),
      sm: window.matchMedia("(min-width: 640px)"),
    };
    const compute = () =>
      q.xl.matches ? "xl" : q.lg.matches ? "lg" : q.md.matches ? "md" : q.sm.matches ? "sm" : "base";
    const handler = () => setBp(compute());
    Object.values(q).forEach((m) => m.addEventListener("change", handler));
    handler();
    return () => Object.values(q).forEach((m) => m.removeEventListener("change", handler));
  }, []);
  return bp;
}

export default function CategoryGrid({
  items,
  expandAll = false,
  increment = 4,
  collapsedCountByBp = { base: 2, sm: 4, lg: 6, xl: 8 }, // 2 rows by default
  renderItem,
}: {
  items: Product[];
  expandAll?: boolean;
  /** How many more to reveal per click */
  increment?: number;
  /** Per-breakpoint collapsed counts */
  collapsedCountByBp?: Partial<Record<Breakpoint, number>>;
  /** Optional custom card renderer */
  renderItem?: (p: Product, i: number) => React.ReactNode;
}) {
  const bp = useBreakpoint();

  const initialCollapsed = useMemo(() => {
    const pick =
      (bp === "xl" ? collapsedCountByBp.xl : undefined) ??
      (bp === "lg" ? collapsedCountByBp.lg : undefined) ??
      (bp === "md" ? collapsedCountByBp.md : undefined) ??
      (bp === "sm" ? collapsedCountByBp.sm : undefined) ??
      collapsedCountByBp.base ??
      6;

    return Math.min(pick, items.length);
  }, [bp, collapsedCountByBp, items.length]);

  const [visible, setVisible] = useState(initialCollapsed);

  useEffect(() => {
    setVisible(initialCollapsed);
  }, [initialCollapsed, items.length]);

  const fullyExpanded = expandAll || visible >= items.length;

  const showMore = () => setVisible((v) => Math.min(v + increment, items.length));
  const showLess = () => setVisible(initialCollapsed);

  const Card = renderItem
    ? renderItem
    : (p: Product, i: number) => <DefaultProductCard key={i} product={p} />;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(expandAll ? items : items.slice(0, visible)).map((p, i) => (
          <Fragment key={String(p.id ?? i)}>{Card(p, i)}</Fragment>
        ))}
      </div>

      {!expandAll && items.length > initialCollapsed && (
        <div className="mt-6 flex justify-center">
          {!fullyExpanded ? (
            <button
              onClick={showMore}
              className="rounded-2xl border px-4 py-2 text-sm hover:bg-muted/30"
              aria-expanded={!fullyExpanded}
            >
              Read more
            </button>
          ) : (
            <button
              onClick={showLess}
              className="rounded-2xl px-4 py-2 text-sm underline"
              aria-expanded={!fullyExpanded}
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
