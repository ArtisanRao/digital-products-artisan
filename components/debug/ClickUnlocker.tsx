"use client";

/**
 * Brutal but safe: scans for elements overlapping a target area (nav/grid)
 * and disables pointer-events on non-interactive overlays (absolute/fixed blocks,
 * backdrops, gradients, etc.). Skips links, buttons, inputs, labels and
 * anything inside the target.
 */
import { useEffect } from "react";

type Props = {
  /** CSS selector of the area that must be clickable (e.g., "nav[data-subcats]" or "#categories-grid") */
  targetSelector: string;
  /** Run automatically on mount (default true) */
  auto?: boolean;
};

export default function ClickUnlocker({ targetSelector, auto = true }: Props) {
  useEffect(() => {
    if (!auto) return;
    tryUnlock(targetSelector);
  }, [targetSelector, auto]);

  return null;
}

function tryUnlock(targetSelector: string) {
  const target = document.querySelector<HTMLElement>(targetSelector);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  // sample a few points across the target bar/grid
  const samplePoints = [
    [rect.left + 10, rect.top + 10],
    [rect.left + rect.width / 2, rect.top + 10],
    [rect.right - 10, rect.top + 10],
    [rect.left + rect.width / 2, rect.top + rect.height / 2],
  ] as const;

  const seen = new Set<HTMLElement>();

  for (const [x, y] of samplePoints) {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) continue;
    collectStack(el, seen);
  }

  // Now go through collected elements and neutralize obvious overlays
  for (const el of seen) {
    if (!el || !el.isConnected) continue;
    // Skip if it's inside the target (that should stay clickable)
    if (target.contains(el)) continue;
    // Skip clear interactive stuff
    if (isInteractive(el)) continue;

    const cs = getComputedStyle(el);
    const isOverlay =
      (cs.position === "absolute" || cs.position === "fixed") &&
      cs.zIndex !== "auto" &&
      Number.isFinite(Number(cs.zIndex)) &&
      Number(cs.zIndex) >= 1 &&
      cs.opacity !== "0" &&
      // large elements spanning the target area
      el.offsetWidth >= target.offsetWidth * 0.5 &&
      el.offsetHeight >= 24;

    if (isOverlay) {
      el.setAttribute("data-clickunlocker", "disabled");
      (el.style as any).pointerEvents = "none";
      // Optional: push it behind if needed
      if (Number(cs.zIndex) >= 10) (el.style as any).zIndex = "0";
    }
  }
}

function collectStack(el: HTMLElement, out: Set<HTMLElement>) {
  let cur: HTMLElement | null = el;
  while (cur) {
    out.add(cur);
    cur = cur.parentElement;
  }
}

function isInteractive(el: HTMLElement) {
  const tag = el.tagName.toLowerCase();
  if (["a", "button", "input", "select", "textarea", "label", "summary", "details"].includes(tag))
    return true;
  // roles that imply interactivity
  const role = el.getAttribute("role");
  if (role && ["button", "link", "menuitem", "tab", "switch"].includes(role)) return true;
  // anything that handles clicks directly
  const onclick = (el as any).onclick;
  if (onclick) return true;
  return false;
}
