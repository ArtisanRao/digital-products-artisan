"use client";

import { useEffect } from "react";

/** Neuters big fixed/absolute overlays inside a given DOM scope */
export default function OverlayFix({ scope = "main" }: { scope?: string }) {
  useEffect(() => {
    const root = document.querySelector(scope) as HTMLElement | null;
    if (!root) return;

    const within = (el: Element) =>
      el instanceof HTMLElement && (el === root || root.contains(el));

    const isBig = (el: Element) => {
      try {
        const r = (el as HTMLElement).getBoundingClientRect();
        const rr = root.getBoundingClientRect();
        const w = Math.min(r.width, rr.width);
        const h = Math.min(r.height, rr.height);
        return w >= innerWidth * 0.8 || h >= innerHeight * 0.2;
      } catch {
        return false;
      }
    };

    const isBlocker = (el: Element) => {
      if (!(el instanceof HTMLElement)) return false;
      // let interactive things be
      if (el.closest("a,button,[role='button'],input,select,textarea")) return false;
      const cs = getComputedStyle(el);
      if (cs.pointerEvents === "none") return false;
      const z = parseInt(cs.zIndex || "0", 10);
      const pos = cs.position;
      const op = parseFloat(cs.opacity || "1");
      const hasBg =
        cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)";
      return (
        within(el) &&
        (pos === "fixed" || pos === "absolute") &&
        z >= 1 &&
        (op < 1 || hasBg) &&
        isBig(el)
      );
    };

    const neuter = (el: HTMLElement) => {
      el.style.pointerEvents = "none";
      el.style.zIndex = "-1";
      el.setAttribute("data-overlay-neutralized", "1");
    };

    const sweep = () => {
      const pts: Array<[number, number]> = [
        [innerWidth / 2, innerHeight / 2],
        [16, 16],
        [innerWidth - 16, 16],
        [16, innerHeight - 16],
        [innerWidth - 16, innerHeight - 16],
      ];
      pts.forEach(([x, y]) => {
        (document.elementsFromPoint(x, y) || []).forEach((el) => {
          if (isBlocker(el)) neuter(el as HTMLElement);
        });
      });
      // make sure links/buttons in scope always accept clicks
      root
        .querySelectorAll<HTMLElement>("a,button,[role='button']")
        .forEach((n) => {
          n.style.pointerEvents = "auto";
        });
    };

    let i = 0;
    const t = setInterval(() => {
      sweep();
      if (++i > 20) clearInterval(t);
    }, 250);
    window.addEventListener("resize", sweep, { passive: true });
    document.addEventListener("visibilitychange", sweep);

    return () => {
      clearInterval(t);
      window.removeEventListener("resize", sweep);
      document.removeEventListener("visibilitychange", sweep);
    };
  }, [scope]);

  return null;
}
