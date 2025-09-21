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

/** Default card (used only if you don't pass a custom renderer) */
function DefaultProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border bg-white/50 p-4 shadow-sm hover:shadow transition">
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"
        />
      ) : null}
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
