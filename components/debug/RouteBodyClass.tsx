// components/debug/RouteBodyClass.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds route-scoped classes to <body> so CSS can force click-through
 * on problematic pages (/categories and /products) only.
 */
export default function RouteBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const b = document.body;
    if (!b) return;

    const classes = new Set<string>(b.className.split(/\s+/).filter(Boolean));

    const isCategories = pathname === "/categories" || pathname.startsWith("/categories/");
    const isProducts   = pathname.startsWith("/products");

    // remove old markers first
    ["route-categories", "route-products"].forEach((c) => classes.delete(c));

    if (isCategories) classes.add("route-categories");
    if (isProducts)   classes.add("route-products");

    b.className = Array.from(classes).join(" ");
  }, [pathname]);

  return null;
}
