"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Item = { label: string; slug: string; href?: string };

export default function SubcategoryNav({
  items,
  activeSlug,
  basePath = "/products",
  className = "",
}: {
  items: Item[];
  activeSlug?: string;
  basePath?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();

  // fall back to current slug from pathname if not provided
  const current = useMemo(() => {
    if (activeSlug) return activeSlug;
    const seg = pathname?.split("/").filter(Boolean) ?? [];
    return seg[seg.length - 1];
  }, [activeSlug, pathname]);

  return (
    <nav
      className={`flex flex-wrap gap-2 py-3 ${className}`}
      // ensure this container receives clicks
      style={{ pointerEvents: "auto" }}
    >
      {items.map((it) => {
        const href =
          it.href ??
          `${basePath}/${it.slug}${
            sp.size ? `?${sp.toString()}` : "" // preserve query (e.g., ?currency=EUR)
          }`;
        const active = current === it.slug;
        return (
          <Link
            key={it.slug}
            href={href}
            className={[
              "px-3 py-1 rounded-full border text-sm transition",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted border-border",
            ].join(" ")}
            // bulletproof: make sure link can be clicked
            style={{ pointerEvents: "auto" }}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
