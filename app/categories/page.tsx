// app/categories/page.tsx — SAFE SERVER VERSION (no client components/hooks)
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { CATEGORIES, categoryImage } from "@/data/categories";

type SP = Record<string, string | string[] | undefined>;

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  // read query on the server
  const sp = (await searchParams) || {};
  const entries = Object.entries(sp).filter(([_, v]) => v != null && v !== "");
  const qs = entries.length
    ? `?${new URLSearchParams(
        entries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v as string)])
      ).toString()}`
    : "";

  return (
    <main className="relative z-[100] max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>

      <div
        id="categories-grid"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {CATEGORIES.map((c) => {
          const pathname = `/categories/${encodeURIComponent(c.slug)}`;
          const href = qs ? `${pathname}${qs}` : pathname;
          const img = categoryImage(c.slug);

          return (
            <Link
              key={c.slug}
              href={href}
              prefetch={false}
              className="group block rounded-2xl border overflow-hidden bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
            >
              <div className="relative w-full bg-gray-50">
                <div className="aspect-[16/9] md:aspect-[3/2] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={c.label}
                    className="h-full w-full object-cover pointer-events-none select-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600">
                  {c.label}
                </h2>
                <InlineMore
                  text={c.description || "Explore products in this category."}
                  lines={2}
                  minChars={1}
                  className="mt-1 text-sm text-gray-600"
                  moreLabel="more"
                  lessLabel="less"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
