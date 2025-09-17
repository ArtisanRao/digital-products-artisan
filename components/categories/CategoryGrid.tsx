// ...top of file unchanged...

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

export default function CategoryGrid({
  items,
  expandAll = false,
  increment = 4,
  collapsedCountByBp = { base: 2, sm: 4, lg: 6, xl: 8 }, // 2 rows by default
  renderItem,
}: {
  items: Product[];
  expandAll?: boolean;
  increment?: number;
  collapsedCountByBp?: Partial<Record<Breakpoint, number>>;
  renderItem?: (p: Product, i: number) => React.ReactNode;
}) {
  const bp = useBreakpoint();

  const initialCollapsed = React.useMemo(() => {
    const pick =
      (bp === "xl" ? collapsedCountByBp.xl : undefined) ??
      (bp === "lg" ? collapsedCountByBp.lg : undefined) ??
      (bp === "md" ? collapsedCountByBp.md : undefined) ??
      (bp === "sm" ? collapsedCountByBp.sm : undefined) ??
      collapsedCountByBp.base ??
      6;

    return Math.min(pick, items.length);
  }, [bp, collapsedCountByBp, items.length]);

  const [visible, setVisible] = React.useState(initialCollapsed);

  React.useEffect(() => {
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
          <React.Fragment key={String((p.id ?? i))}>{Card(p, i)}</React.Fragment>
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
