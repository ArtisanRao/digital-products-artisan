// app/admin/category-audit/page.tsx
export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";

type Row = {
  id: any;
  slug: string | null;
  title: string;
  fieldSlug: string | null;
  fieldLabel: string | null;
  inferredSlug: string | null;
  inferredLabel: string | null;
  sources: {
    category: string | null;
    categories: string[];
    tags: string[];
    collection: string | null;
  };
  mismatch: boolean;
  unknown: boolean;
};

export default function CategoryAuditPage() {
  const [data, setData] = useState<{
    total: number;
    matched: number;
    mismatched: number;
    unknown: number;
    rows: Row[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/debug/category-audit", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Category Audit</h1>
        <p className="mt-2 text-gray-600">Loading…</p>
      </main>
    );
  }

  const mismatched = data.rows.filter((r) => r.mismatch);
  const unknown = data.rows.filter((r) => r.unknown);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Category Audit</h1>
      <p className="mt-2 text-gray-600">
        Total: {data.total} • Matched: {data.matched} •{" "}
        <span className="text-amber-700 font-medium">Mismatched: {data.mismatched}</span>{" "}
        • <span className="text-blue-700 font-medium">Unknown: {data.unknown}</span>
      </p>

      {/* Mismatches */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Mismatches</h2>
        {mismatched.length === 0 ? (
          <p className="text-gray-600 mt-2">None 🎉</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Current (field)</th>
                  <th className="p-2">Suggested (inferred)</th>
                  <th className="p-2">Sources</th>
                </tr>
              </thead>
              <tbody>
                {mismatched.map((r) => (
                  <tr key={`${r.id}`} className="border-t">
                    <td className="p-2 whitespace-nowrap">{String(r.id)}</td>
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">
                      <div className="font-medium">{r.fieldLabel ?? "—"}</div>
                      <div className="text-gray-500">{r.fieldSlug ?? "—"}</div>
                    </td>
                    <td className="p-2">
                      <div className="font-medium">{r.inferredLabel ?? "—"}</div>
                      <div className="text-gray-500">{r.inferredSlug ?? "—"}</div>
                    </td>
                    <td className="p-2 text-gray-600">
                      <div>category: {r.sources.category ?? "—"}</div>
                      <div>categories: {r.sources.categories.join(", ") || "—"}</div>
                      <div>tags: {r.sources.tags.join(", ") || "—"}</div>
                      <div>collection: {r.sources.collection ?? "—"}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Unknowns */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Unknown (no clear category)</h2>
        {unknown.length === 0 ? (
          <p className="text-gray-600 mt-2">None 🎉</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Sources</th>
                </tr>
              </thead>
              <tbody>
                {unknown.map((r) => (
                  <tr key={`${r.id}`} className="border-t">
                    <td className="p-2 whitespace-nowrap">{String(r.id)}</td>
                    <td className="p-2">{r.title}</td>
                    <td className="p-2 text-gray-600">
                      <div>category: {r.sources.category ?? "—"}</div>
                      <div>categories: {r.sources.categories.join(", ") || "—"}</div>
                      <div>tags: {r.sources.tags.join(", ") || "—"}</div>
                      <div>collection: {r.sources.collection ?? "—"}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
