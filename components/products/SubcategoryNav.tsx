"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Item = { label: string; slug?: string; href?: string };

function encodeSeg(s: string) {
  return encodeURIComponent(String(s));
}

function joinBase(basePath: string, slug?: string) {
  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  if (!slug) return base || "/";
  return `${base}/${encodeSeg(slug)}`;
}

function appendQuery(href: string, qs: string) {
  if (!qs) return href;
  return href.includes("?") ? `${href}&${qs}` : `${href}?${qs}`;
}

export default function SubcategoryNav({
  items,
  activeSlug,
  basePath = "/categories", // ✅ default to categories
  className = "",
}: {
  items: Item[];
  activeSlug?: string;
  basePath?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();

  // current slug from pathname, unless explicitly provided
  const current = useMemo(() => {
    if (activeSlug) return activeSlug;
    const seg = pathname?.split("/").filter(Boolean) ?? [];
    return seg[seg.length - 1];
  }, [activeSlug, pathname]);

  // preserve all current query params (e.g., currency)
  const queryStr = sp.size ? sp.toString() : "";

  return (
    <nav
      className={`flex flex-wrap gap-2 py-3 clickable-surface ${className}`}
      style={{ pointerEvents: "auto", isolation: "isolate", zIndex: 1000 }}
      aria-label="Subcategories"
    >
      {items.map((it) => {
        // Prefer explicit href; otherwise build from basePath + slug
        const built = it.href ? it.href : joinBase(basePath, it.slug);
        const href = queryStr ? appendQuery(built, queryStr) : built;

        // Active detection: match by slug if provided, else compare path
        const key = it.slug ?? it.href ?? it.label;
        const active =
          (it.slug && current === it.slug) ||
          (!!it.href && pathname === it.href.replace(/\?.*$/, ""));

        return (
          <Link
            key={key}
            href={href}
            prefetch={false} // ✅ avoid noisy prefetch failures
            className={[
              "px-3 py-1 rounded-full border text-sm transition",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted border-border",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
            style={{ pointerEvents: "auto", position: "relative", zIndex: 1001 }}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
