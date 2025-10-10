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
      // default pattern if only slug is known
      const base = `/images/categories/${slug}/card`;
      list.push(`${base}.jpg`, `${base}.png`, `${base}.webp`);
    }

    // Append global fallbacks and remove duplicates
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
      // Ensure the visual can never eat clicks; anchor handles them
      className={[
        "pointer-events-none select-none",
        "h-full w-full object-cover",
        className,
      ].join(" ")}
      // If a candidate fails, try the next one
      onError={() => {
        if (idx + 1 < candidates.length) setIdx((i) => i + 1);
      }}
      // Belt & suspenders: if some class overrides pointer-events, inline style still prevents capture
      style={{ pointerEvents: "none", userSelect: "none" }}
      draggable={false}
    />
  );
}
