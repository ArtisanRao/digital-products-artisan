"use client";

import { useEffect } from "react";

/**
 * Neutralizes accidental overlays that sit above interactive elements.
 * No Next hooks like useSearchParams, so it's CSR-safe everywhere.
 */
export default function ClickDoctor() {
  useEffect(() => {
    const mark = "data-clickdoctor-disabled";

    const isOverlay = (el: Element) => {
      const cs = getComputedStyle(el as HTMLElement);
      const pos = cs.position;
      const pe = cs.pointerEvents;
      const zi = parseInt(cs.zIndex || "0", 10);
      // big-ish surfaces with stacking that could block clicks
      return (
        pe !== "none" &&
        (pos === "fixed" || pos === "absolute" || zi >= 0) &&
        (el as HTMLElement).getBoundingClientRect().height > 30 &&
        (el as HTMLElement).getBoundingClientRect().width > 30
      );
    };

    const isInteractive = (el: Element | null) => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "A" || tag === "BUTTON") return true;
      const role = (el as HTMLElement).getAttribute("role");
      return role === "button" || role === "link";
    };

    const harden = (el: Element) => {
      const h = el as HTMLElement;
      h.style.pointerEvents = "auto";
      h.style.position = "relative";
      if (!h.style.zIndex) h.style.zIndex = "1000";
    };

    const disableOverlay = (el: Element) => {
      const h = el as HTMLElement;
      if (h.getAttribute(mark) === "1") return;
      h.style.pointerEvents = "none";
      h.style.zIndex = "-1";
      h.setAttribute(mark, "1");
    };

    const handlePoint = (ev: PointerEvent | MouseEvent | TouchEvent) => {
      try {
        const x =
          (ev as PointerEvent).clientX ??
          (ev as MouseEvent).clientX ??
          (ev as TouchEvent).touches?.[0]?.clientX ??
          8;
        const y =
          (ev as PointerEvent).clientY ??
          (ev as MouseEvent).clientY ??
          (ev as TouchEvent).touches?.[0]?.clientY ??
          8;

        const stack = document.elementsFromPoint(x, y);
        const topInteractive = stack.find(isInteractive);
        if (topInteractive) harden(topInteractive);

        // If there's any overlay above an interactive, disable it
        for (const el of stack) {
          if (isOverlay(el)) {
            // stop at the first interactive we meet (don’t nuke the link itself)
            if (isInteractive(el)) break;
            disableOverlay(el);
          }
        }
      } catch {}
    };

    const opts = { passive: true } as const;
    window.addEventListener("pointermove", handlePoint, opts);
    window.addEventListener("touchstart", handlePoint, opts);
    window.addEventListener("mousemove", handlePoint, opts);

    return () => {
      window.removeEventListener("pointermove", handlePoint);
      window.removeEventListener("touchstart", handlePoint);
      window.removeEventListener("mousemove", handlePoint);
    };
  }, []);

  return null;
}
