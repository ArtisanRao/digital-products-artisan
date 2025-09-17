"use client";

import * as React from "react";

type Props = {
  text?: string | null;
  /** lines shown when collapsed (defaults to 2 – like your /products list) */
  lines?: 1 | 2 | 3 | 4;
  /** classes for the paragraph (put your color/size/margins here) */
  className?: string;
  /** classes for the toggle button */
  buttonClassName?: string;
  moreLabel?: string;
  lessLabel?: string;
  /** start expanded */
  initialOpen?: boolean;
};

export default function InlineMore({
  text,
  lines = 2,
  className = "text-gray-600 text-sm",
  buttonClassName = "mt-1 text-sm font-medium text-blue-600 hover:underline",
  moreLabel = "More",
  lessLabel = "Less",
  initialOpen = false,
}: Props) {
  const [open, setOpen] = React.useState(initialOpen);
  const [canToggle, setCanToggle] = React.useState(false);
  const pRef = React.useRef<HTMLParagraphElement>(null);

  // Reset open when content/lines change
  React.useEffect(() => {
    setOpen(initialOpen);
  }, [text, lines, initialOpen]);

  // Robust overflow detection (measure unclamped height)
  React.useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const compute = () => {
      const style = window.getComputedStyle(el);
      let lineHeight = parseFloat(style.lineHeight);
      if (!lineHeight || Number.isNaN(lineHeight)) {
        const fontSize = parseFloat(style.fontSize) || 16;
        lineHeight = fontSize * 1.2; // reasonable fallback
      }
      const clampHeight = lineHeight * lines;

      // Temporarily disable clamping to read full content height
      const prev = {
        display: el.style.display,
        overflow: el.style.overflow,
        WebkitLineClamp: (el.style as any).WebkitLineClamp,
        WebkitBoxOrient: (el.style as any).WebkitBoxOrient,
      };
      el.style.display = "block";
      el.style.overflow = "visible";
      (el.style as any).WebkitLineClamp = "unset";
      (el.style as any).WebkitBoxOrient = "unset";

      // Read full content height
      const fullHeight = el.scrollHeight;

      // Restore previous inline styles
      el.style.display = prev.display;
      el.style.overflow = prev.overflow;
      (el.style as any).WebkitLineClamp = prev.WebkitLineClamp;
      (el.style as any).WebkitBoxOrient = prev.WebkitBoxOrient;

      setCanToggle(fullHeight > clampHeight + 1); // tiny fudge for rounding
    };

    // Initial + on resize
    compute();
    const onResize = () => compute();

    // Resize observer (guard for older browsers / SSR)
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(compute);
      ro.observe(el);
    }
    window.addEventListener("resize", onResize);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [text, lines]);

  if (!text) return null;

  const clampClass =
    open
      ? ""
      : lines === 1
      ? "line-clamp-1"
      : lines === 3
      ? "line-clamp-3"
      : lines === 4
      ? "line-clamp-4"
      : "line-clamp-2"; // default

  return (
    <div>
      <p ref={pRef} className={`${className} ${clampClass}`}>{text}</p>
      {canToggle && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={buttonClassName}
          aria-expanded={open}
        >
          {open ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
