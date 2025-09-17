"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = React.useState<Breakpoint>("base");
  React.useEffect(() => {
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

export type ExpandableGridProps<T> = {
  items: T[];
  /** Fallback count when collapsed (if no per-bp override). Default: 6 */
  collapsedCount?: number;
  /** Per-breakpoint collapsed counts. Use `false` to mean “show all” at that breakpoint. */
  collapsedCountByBp?: Partial<Record<Breakpoint, number | false>>;
  /** How many more to reveal per click. Default: 4 */
  increment?: number;
  /** Render each card */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Container className */
  className?: string;
  /** Grid className */
  gridClassName?: string;
  /** Labels */
  labels?: { more?: string; less?: string };
};

export default function ExpandableGrid<T>({
  items,
  renderItem,
  collapsedCount = 6,
  collapsedCountByBp = { base: 6, sm: 4, lg: 6, xl: 8 },
  increment = 4,
  className,
  gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  labels = { more: "More", less: "Show less" },
}: ExpandableGridProps<T>) {
  const bp = useBreakpoint();

  const initialCollapsed = React.useMemo(() => {
    // pick the per-bp value (may be number or false) or fallback
    const map = collapsedCountByBp || {};
    const rawPick =
      (bp === "xl" ? map.xl : undefined) ??
      (bp === "lg" ? map.lg : undefined) ??
      (bp === "md" ? map.md : undefined) ??
      (bp === "sm" ? map.sm : undefined) ??
      map.base ??
      collapsedCount;

    // If explicitly false → show all initially
    if (rawPick === false) return items.length;

    // Otherwise coerce to number and clamp
    const n = typeof rawPick === "number" ? rawPick : collapsedCount;
    return Math.min(n, items.length);
  }, [bp, collapsedCountByBp, collapsedCount, items.length]);

  const [visible, setVisible] = React.useState(initialCollapsed);

  // Reset visibility when bp/items change
  React.useEffect(() => {
    setVisible(initialCollapsed);
  }, [initialCollapsed, items.length]);

  const fullyExpanded = visible >= items.length;

  const showMore = () => setVisible((v) => Math.min(v + increment, items.length));
  const showLess = () => setVisible(initialCollapsed);

  return (
    <div className={className}>
      <div className={gridClassName}>
        {items.slice(0, visible).map((item, i) => (
          <React.Fragment key={String((item as any)?.id ?? i)}>
            {renderItem(item, i)}
          </React.Fragment>
        ))}
      </div>

      {items.length > initialCollapsed && (
        <div className="mt-6 flex justify-center">
          {!fullyExpanded ? (
            <Button
              type="button"
              onClick={showMore}
              variant="outline"
              className="gap-2"
              aria-expanded={!fullyExpanded}
            >
              <ChevronDown className="h-4 w-4" />
              {labels.more ?? "More"}
            </Button>
          ) : (
            <button
              type="button"
              onClick={showLess}
              className="rounded-2xl px-4 py-2 text-sm underline"
              aria-expanded={!fullyExpanded}
            >
              <span className="inline-flex items-center gap-1">
                <ChevronUp className="h-4 w-4" />
                {labels.less ?? "Show less"}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
