// components/debug/ClickDelegator.tsx
"use client";

import { useEffect } from "react";

/**
 * Global capture-phase click delegator.
 * Any click/tap inside a card will navigate to the nearest <a href="...">,
 * even if a child blocks bubble-phase events or an overlay sits above it.
 */
export default function ClickDelegator() {
  useEffect(() => {
    const onClickCapture = (ev: MouseEvent) => {
      // Ignore modified clicks (open in new tab, etc.)
      if (ev.defaultPrevented) return;
      if (ev.button !== 0) return; // left click only
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      // Walking composed path catches shadow DOM / weird wrappers
      const path = (ev.composedPath?.() ?? []) as Element[];
      let anchor: HTMLAnchorElement | null = null;

      for (const el of path) {
        if (!el || !(el as Element).closest) continue;
        const a = (el as Element).closest("a[href]") as HTMLAnchorElement | null;
        if (a) {
          anchor = a;
          break;
        }
      }

      if (!anchor) return;

      // Respect target="_blank" / downloads
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      const download = anchor.hasAttribute("download");
      if (!href || download || (target && target.toLowerCase() === "_blank")) return;

      // Don’t double-handle real external links
      const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(location.origin);
      if (isExternal) return;

      // Force navigation (prevents “static/unresponsive” cards)
      ev.preventDefault();
      ev.stopPropagation();
      // Use assign to keep back button behavior
      try {
        const url = new URL(href, location.href);
        window.location.assign(url.toString());
      } catch {
        // If somehow invalid, fallback to setting location
        (window as any).location = href;
      }
    };

    // Capture-phase so we beat any bubbling blockers
    document.addEventListener("click", onClickCapture, { capture: true, passive: false });

    return () => {
      document.removeEventListener("click", onClickCapture, { capture: true } as any);
    };
  }, []);

  return null;
}
