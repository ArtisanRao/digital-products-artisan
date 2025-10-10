// components/categories/SafeCategoryImage.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  /** Explicit image path OR derive from slug */
  src?: string;                 // e.g. "/images/categories/ai-and-chatgpt-guides/card.jpg"
  slug?: string;                // e.g. "ai-and-chatgpt-guides"
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  /** Allow callers (e.g., CategoryCard) to set draggable explicitly */
  draggable?: boolean;
};

const GLOBAL_FALLBACKS = [
  "/images/categories/_default/card.jpg",
  "/images/categories/_default/card.png",
  "/placeholder.jpg",
  "/images/placeholder.jpg",
];

export default function SafeCategoryImage({
  src,
  slug,
  alt,
  width = 1200,
  height = 900,
  priority = false,
  className = "",
  draggable, // <- new
}: Props) {
  // Build candidate list (deduped, ordered)
  const candidates = useMemo(() => {
    const list: string[] = [];

    if (src) {
      list.push(src);
      // try alternate extensions for same basename
      if (/\.jpe?g$/i.test(src)) {
        list.push(src.replace(/\.jpe?g$/i, ".png"), src.replace(/\.jpe?g$/i, ".webp"));
      } else if (/\.png$/i.test(src)) {
        list.push(src.replace(/\.png$/i, ".jpg"), src.replace(/\.png$/i, ".webp"));
      } else if (/\.webp$/i.test(src)) {
        list.push(src.replace(/\.webp$/i, ".jpg"), src.replace(/\.webp$/i, ".png"));
      }
    } else if (slug) {
      const base = `/images/categories/${slug}/card`;
      list.push(`${base}.jpg`, `${base}.png`, `${base}.webp`);
    }

    return Array.from(new Set([...list, ...GLOBAL_FALLBACKS]));
  }, [src, slug]);

  const [idx, setIdx] = useState(0);

  return (
    <Image
      src={candidates[idx]}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      // Ensure visuals never intercept clicks; the anchor handles them
      className={[
        "pointer-events-none select-none",
        "h-full w-full object-cover",
        className,
      ].join(" ")}
      onError={() => {
        if (idx + 1 < candidates.length) setIdx((i) => i + 1);
      }}
      // belt & suspenders against any CSS overrides
      style={{ pointerEvents: "none", userSelect: "none" }}
      draggable={draggable ?? false}
    />
  );
}
