// components/debug/OverlayFix.tsx
"use client";

import { useEffect } from "react";

/**
 * Aggressively neuters fixed/absolute overlays inside a given DOM scope so links & buttons remain clickable.
 * Safe to mount multiple times. No-op on SSR.
 *
 * Heuristics:
 *  - Only elements within `scope` (default: "main")
 *  - position: fixed|absolute
 *  - pointer-events != none
 *  - z-index >= 1
 *  - visually large (≥80% viewport width OR ≥20% viewport height) relative to the scope
 *  - likely visual layer (opacity < 1 OR has background color)
 *  - never touches interactive elements or their ancestors (a, button, [role=button], inputs, selects, textareas)
 */
export default function OverlayFix({ scope = "main" }: { scope?: string }) {
  useEffect(() => {
    const root = document.querySelector(scope) as HTMLElement | null;
    if (!root) return;

    const within = (el: Element) =>
      el instanceof HTMLElement && (el === root || root.contains(el));

    const isInteractiveOrInside = (el: Element) =>
      !!(el instanceof HTMLElement &&
        el.closest("a,button,[role='button'],input,select,textarea"));

    const isBigRelativeToScope = (el: HTMLElement) => {
      try {
        const r = el.getBoundingClientRect();
        const rr = root!.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        // Use dimension relative to viewport but capped by scope
        const vw = Math.min(rr.width, window.innerWidth);
        const vh = Math.min(rr.height, window.innerHeight);
        return r.width >= vw * 0.8 || r.height >= vh * 0.2;
      } catch {
        return false;
      }
    };

    const isLikelyOverlay = (el: Element) => {
      if (!(el instanceof HTMLElement)) return false;
      if (!within(el)) return false;
      if (isInteractiveOrInside(el)) return false;

      const cs = getComputedStyle(el);
      if (cs.pointerEvents === "none") return false;

      const pos = cs.position;
      if (pos !== "fixed" && pos !== "absolute") return false;

      const z = parseInt(cs.zIndex || "0", 10);
      if (Number.isNaN(z) || z < 1) return false;

      const op = parseFloat(cs.opacity || "1");
      const bg = cs.backgroundColor;
      const hasBg = !!bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";

      if (!isBigRelativeToScope(el)) return false;

      return op < 1 || hasBg || z >= 10; // biased towards catching real overlays
    };

    const neuter = (el: HTMLElement) => {
      // idempotent
      if (el.dataset.overlayNeutralized === "1") return;
      el.style.pointerEvents = "none";
      el.style.zIndex = "-1";
      el.dataset.overlayNeutralized = "1";
    };

    const enableInteractive = () => {
      // Ensure interactive targets remain click-through
      root!
        .querySelectorAll<HTMLElement>("a,button,[role='button'],input,select,textarea")
        .forEach((n) => {
          n.style.pointerEvents = "auto";
          n.style.position = n.style.position || "relative";
          // boost above stray layers without breaking layout
          if (!n.style.zIndex) n.style.zIndex = "30";
        });
    };

    const sweepFromPoints = () => {
      const rr = root!.getBoundingClientRect();
      const pts: Array<[number, number]> = [
        [rr.left + rr.width / 2, rr.top + rr.height / 2],
        [rr.left + 16, rr.top + 16],
        [rr.right - 16, rr.top + 16],
        [rr.left + 16, rr.bottom - 16],
        [rr.right - 16, rr.bottom - 16],
      ];
      pts.forEach(([x, y]) => {
        const stack = document.elementsFromPoint(
          Math.max(Math.min(x, window.innerWidth - 1), 0),
          Math.max(Math.min(y, window.innerHeight - 1), 0)
        );
        for (const el of stack) {
          if (isLikelyOverlay(el)) neuter(el as HTMLElement);
        }
      });
      enableInteractive();
    };

    // Initial repeated sweeps (catch lazy decorations)
    let count = 0;
    const it = setInterval(() => {
      sweepFromPoints();
      if (++count >= 24) clearInterval(it); // ~6s @ 250ms
    }, 250);

    // Mutation observer to react to late-added overlays
    const mo = new MutationObserver((muts) => {
      let touched = false;
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement && within(n)) {
            if (isLikelyOverlay(n)) {
              neuter(n);
              touched = true;
            }
            // also scan shallow children
            n.querySelectorAll("*").forEach((c) => {
              if (c instanceof HTMLElement && isLikelyOverlay(c)) {
                neuter(c);
                touched = true;
              }
            });
          }
        });
      }
      if (touched) enableInteractive();
    });
    mo.observe(root, { subtree: true, childList: true, attributes: false });

    // Re-run on viewport changes / tab switches
    const onResize = () => sweepFromPoints();
    const onVisibility = () => sweepFromPoints();
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    // First pass immediately
    sweepFromPoints();

    return () => {
      clearInterval(it);
      mo.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scope]);

  return null;
}
