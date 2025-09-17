"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ExpandableGridProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  /** How many items are visible when collapsed (fallback if no per-breakpoint config) */
  collapsedCount?: number; // default 6
  /** How many more to reveal per click */
  increment?: number; // default 6
  /** Optional id for aria-controls */
  id?: string;
  /** Hide this component’s own controls and force fully expanded (for a parent “Expand all”) */
  forceExpanded?: boolean;
  /** Per-breakpoint initial visible counts (computed on client). */
  collapsedCountByBp?: Partial<{
    base: number; // <640px
    sm: number;   // ≥640px
    md: number;   // ≥768px
    lg: number;   // ≥1024px
    xl: number;   // ≥1280px
  }>;
  className?: string;
  moreLabel?: string; // default "Read more"
  lessLabel?: string; // default "Show less"
};

function useBreakpoint(): "xl" | "lg" | "md" | "sm" | "base" {
  const [bp, setBp] = React.useState<"xl" | "lg" | "md" | "sm" | "base">("base");
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
    Object.values(q).forEach(m => m.addEventListener("change", handler));
    handler();
    return () => Object.values(q).forEach(m => m.removeEventListener("change", handler));
  }, []);
  return bp;
}

export function ExpandableGrid<T>({
  items,
  renderItem,
  collapsedCount = 6,
  increment = 6,
  id,
  forceExpanded,
  collapsedCountByBp,
  className,
  moreLabel = "Read more",
  lessLabel = "Show less",
}: ExpandableGridProps<T>) {
  const bp = useBreakpoint();
  const initialCollapsed = React.useMemo(() => {
    if (!collapsedCountByBp) return Math.min(collapsedCount, items.length);
    const map = { base: collapsedCountByBp.base, sm: collapsedCountByBp.sm, md: collapsedCountByBp.md, lg: collapsedCountByBp.lg, xl: collapsedCountByBp.xl };
    const pick =
      (bp === "xl" && map.xl) ??
      (bp === "lg" && map.lg) ??
      (bp === "md" && map.md) ??
      (bp === "sm" && map.sm) ??
      map.base ??
      collapsedCount;
    return Math.min(pick!, items.length);
  }, [bp, collapsedCountByBp, collapsedCount, items.length]);

  const [visible, setVisible] = React.useState(initialCollapsed);

  // Recalculate when items or breakpoint change
  React.useEffect(() => {
    setVisible(initialCollapsed);
  }, [initialCollapsed, items.length]);

  const contentId = id ? `${id}-grid` : undefined;
  const fullyExpanded = forceExpanded || visible >= items.length;

  const showMore = () => setVisible(v => Math.min(v + increment, items.length));
  const showLess = () => setVisible(initialCollapsed);

  return (
    <div className={className}>
      <div
        id={contentId}
        role="region"
        aria-label="Category products"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence initial={false}>
          {items.slice(0, forceExpanded ? items.length : visible).map((item, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {renderItem(item, i)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!forceExpanded && items.length > initialCollapsed && (
        <div className="mt-6 flex justify-center">
          {!fullyExpanded ? (
            <Button
              variant="outline"
              onClick={showMore}
              aria-controls={contentId}
              aria-expanded={!fullyExpanded}
              className="rounded-2xl"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              {moreLabel}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={showLess}
              aria-controls={contentId}
              aria-expanded={!fullyExpanded}
              className="rounded-2xl"
            >
              <ChevronUp className="mr-2 h-4 w-4" />
              {lessLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
