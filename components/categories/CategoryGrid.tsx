"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** Minimal product shape this grid needs. Extend as you like. */
export type Product = {
  id: string | number;
  title: string;
  slug?: string;
  price?: number | string;
  image?: string;
  description?: string; // shown when provided
};

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

/** Detect current Tailwind breakpoint that matters for our grid. */
function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("base");

  useEffect(() => {
    // Keep in sync with your grid classes below.
    const q = {
      xl: window.matchMedia("(min-width: 1280px)"),
      lg: window.matchMedia("(min-width: 1024px)"),
      md: window.matchMedia("(min-width: 768px)"),
      sm: window.matchMedia("(min-width: 640px)"),
    };

    const compute = (): Breakpoint =>
      q.xl.matches ? "xl" : q.lg.matches ? "lg" : q.md.matches ? "md" : q.sm.matches ? "sm" : "base";

    const handler = () => setBp(compute());
    Object.values(q).forEach((m) => m.addEventListener("change", handler));
    handler(); // run once on mount

    return () => Object.values(q).forEach((m) => m.removeEventListener("change", handler));
  }, []);

  return bp;
}

/** Default card (used only if you don't pass a custom renderer) */
function DefaultProductCard({ product }: { product: Product }) {
  const content = (
    <article className="group rounded-2xl border bg-white/50 p-4 shadow-sm transition hover:shadow-md">
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"
        />
      ) : null}
      <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
      {product.description ? (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
      ) : null}
      {product.price !== undefined && (
        <p className="mt-2 text-xs text-muted-foreground">From {String(product.price)}</p>
      )}
    </article>
  );

  return product.slug ? (
    <Link href={`/products/${product.slug}`} className="block" aria-label={product.title}>
      {content}
    </Link>
  ) : (
    content
  );
}

export default function CategoryGrid({
  items,
  expandAll = false,
  /** How many more to reveal per click (used if not using rowsCollapsed) */
  increment = 4,
  /**
   * If you prefer “show N rows” instead of hard counts, set rowsCollapsed (default 2).
   * We’ll compute N = rowsCollapsed * visibleColumnsForBreakpoint.
   * If you pass collapsedCountByBp, that takes precedence.
   */
  rowsCollapsed = 2,
  /** Per-breakpoint collapsed counts (overrides rowsCollapsed if provided) */
  collapsedCountByBp,
  /** Optional custom card renderer */
  renderItem,
  /** Optional price formatter for numbers (e.g., (n)=> new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n)) */
  formatPrice,
  /** Labels */
  moreLabel = "Read more",
  lessLabel = "Show less",
}: {
  items: Product[];
  expandAll?: boolean;
  increment?: number;
  rowsCollapsed?: number;
  collapsedCountByBp?: Partial<Record<Breakpoint, number>>;
  renderItem?: (p: Product, i: number) => React.ReactNode;
  formatPrice?: (value: number) => string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const bp = useBreakpoint();

  // Prepare a normalized list if a price formatter is supplied
  const normalizedItems = useMemo(() => {
    if (!formatPrice) return items;
    return items.map((p) => {
      if (typeof p.price === "number") {
        return { ...p, price: formatPrice(p.price) };
      }
      return p;
    });
  }, [items, formatPrice]);

  // Given the grid classes below: base:1, sm:2, md:2, lg:3, xl:4 columns.
  const columnsForBp = (b: Breakpoint) => (b === "xl" ? 4 : b === "lg" ? 3 : b === "md" ? 2 : b === "sm" ? 2 : 1);

  const computedCollapsedFromRows = useMemo(() => {
    const cols = columnsForBp(bp);
    return Math.max(cols * rowsCollapsed, cols); // at least one full row
  }, [bp, rowsCollapsed]);

  const initialCollapsed = useMemo(() => {
    // If caller provided explicit per-bp counts, prefer those.
    const pick =
      (bp === "xl" ? collapsedCountByBp?.xl : undefined) ??
      (bp === "lg" ? collapsedCountByBp?.lg : undefined) ??
      (bp === "md" ? collapsedCountByBp?.md : undefined) ??
      (bp === "sm" ? collapsedCountByBp?.sm : undefined) ??
      collapsedCountByBp?.base ??
      computedCollapsedFromRows;

    return Math.min(pick, normalizedItems.length);
  }, [bp, collapsedCountByBp, computedCollapsedFromRows, normalizedItems.length]);

  const [visible, setVisible] = useState(initialCollapsed);

  useEffect(() => {
    setVisible(initialCollapsed);
  }, [initialCollapsed, normalizedItems.length]);

  const fullyExpanded = expandAll || visible >= normalizedItems.length;
  const showMore = () => setVisible((v) => Math.min(v + increment, normalizedItems.length));
  const showLess = () => setVisible(initialCollapsed);

  const Card = renderItem
    ? renderItem
    : (p: Product, i: number) => <DefaultProductCard key={String(p.id ?? i)} product={p} />;

  const gridId = "category-grid";

  return (
    <div>
      <div
        id={gridId}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {(expandAll ? normalizedItems : normalizedItems.slice(0, visible)).map((p, i) => (
          <Fragment key={String(p.id ?? i)}>{Card(p, i)}</Fragment>
        ))}
      </div>

      {!expandAll && normalizedItems.length > initialCollapsed && (
        <div className="mt-6 flex justify-center">
          {!fullyExpanded ? (
            <button
              onClick={showMore}
              className="rounded-2xl border px-4 py-2 text-sm hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-expanded={!fullyExpanded}
              aria-controls={gridId}
            >
              {moreLabel}
            </button>
          ) : (
            <button
              onClick={showLess}
              className="rounded-2xl px-4 py-2 text-sm underline focus:outline-none focus:ring-2 focus:ring-ring"
              aria-expanded={!fullyExpanded}
              aria-controls={gridId}
            >
              {lessLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
