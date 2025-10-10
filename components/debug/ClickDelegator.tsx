// components/debug/ClickDelegator.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClickDelegator() {
  const router = useRouter();

  useEffect(() => {
    const root = document.getElementById("categories-grid");
    if (!root) return;

    const handler = (evt: Event) => {
      const target = evt.target as Element | null;
      if (!target) return;

      // Only operate inside the grid
      const grid = target.closest("#categories-grid");
      if (!grid) return;

      // Find the card link to navigate to
      const cardLink = (target as Element).closest<HTMLAnchorElement>("a[data-card-link]");
      if (!cardLink) return;

      // Prevent anything else from swallowing it
      evt.preventDefault();
      evt.stopPropagation();

      // Use router for client-side nav (fallback to hard nav)
      const href = cardLink.getAttribute("href") || "#";
      if (href && href !== "#") {
        try {
          router.push(href);
        } catch {
          window.location.assign(href);
        }
      }
    };

    // Capture phase to beat other listeners
    root.addEventListener("click", handler, { capture: true, passive: false });
    root.addEventListener("touchend", handler, { capture: true, passive: false });

    return () => {
      root.removeEventListener("click", handler, { capture: true } as any);
      root.removeEventListener("touchend", handler, { capture: true } as any);
    };
  }, [router]);

  return null;
}
