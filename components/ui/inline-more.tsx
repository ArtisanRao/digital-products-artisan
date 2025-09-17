"use client";

import * as React from "react";

type Props = {
  text?: string | null;
  /** lines shown when collapsed (defaults to 2) */
  lines?: 1 | 2 | 3 | 4;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
  /** NEW: show the toggle if text length >= minChars, even if it doesn't overflow lines */
  minChars?: number;
  /** NEW: force showing the toggle regardless of overflow/length */
  alwaysShow?: boolean;
};

export default function InlineMore({
  text,
  lines = 2,
  className = "text-gray-600 text-sm",
  moreLabel = "More",
  lessLabel = "Less",
  minChars,
  alwaysShow = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [canToggle, setCanToggle] = React.useState(false);
  const pRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const compute = () => {
      const lhStr = window.getComputedStyle(el).lineHeight;
      const lineHeight = parseFloat(lhStr) || 20;
      const maxHeight = lineHeight * lines;

      const overflowByLines = el.scrollHeight - 1 > maxHeight; // small fudge
      const overflowByChars = (minChars ?? 0) > 0 && (text?.length ?? 0) >= (minChars ?? 0);

      setCanToggle(Boolean(alwaysShow || overflowByLines || overflowByChars));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [text, lines, minChars, alwaysShow]);

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
      : "line-clamp-2";

  return (
    <div>
      <p ref={pRef} className={`${className} ${clampClass}`}>{text}</p>
      {canToggle && (
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="mt-1 text-sm font-medium text-blue-600 hover:underline"
          aria-expanded={open}
        >
          {open ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
