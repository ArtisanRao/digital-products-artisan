// app/categories/layout.tsx
import OverlayFix from "@/components/debug/OverlayFix";

export const dynamic = "force-dynamic";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      id="cat-scope"
      className="relative z-[100] clickable-surface pe-force-auto"
      style={{ pointerEvents: "auto", isolation: "isolate" }}
      data-route="categories"
    >
      {/* 🔓 Neuter any fixed/absolute overlay inside this route */}
      <OverlayFix scope="#cat-scope" />
      {/* Final, SSR-safe assertion: every <a>/<button> stays clickable */}
      <style>{`
        #cat-scope a, #cat-scope button, #cat-scope [role="button"] {
          pointer-events: auto !important;
          position: relative;
          z-index: 20;
        }
      `}</style>
      {children}
    </section>
  );
}
