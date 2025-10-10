"use client";

import { useEffect } from "react";

const SELECTORS = [
  ".overlay",
  ".hero-overlay",
  ".bg-gradient",
  ".gradient-overlay",
  ".noise",
  ".scrim",
  ".mask",
  ".glow",
  "[data-overlay]",
  '[aria-hidden="true"][data-decorative="true"]',
];

export default function ClickthroughFix() {
  useEffect(() => {
    const kill = () => {
      document.querySelectorAll<HTMLElement>(SELECTORS.join(",")).forEach((el) => {
        // Only nerf large positioned layers that could cover content
        const cs = getComputedStyle(el);
        if (["fixed", "absolute"].includes(cs.position)) {
          el.style.pointerEvents = "none";
        }
      });
    };
    kill();

    // Re-apply after route transitions or UI changes
    const mo = new MutationObserver(kill);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return null;
}
