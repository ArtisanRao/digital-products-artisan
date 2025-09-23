"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  // pass either the explicit category image OR the slug
  src?: string;          // e.g. "/images/categories/ai-and-chatgpt-guides/card.jpg"
  slug?: string;         // e.g. "ai-and-chatgpt-guides"
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

const GLOBAL_FALLBACKS = [
  "/images/categories/_default/card.jpg",
  "/images/categories/_default/card.png",
  "/placeholder.jpg",                // you already have this in /public
  "/images/placeholder.jpg",         // backup if you prefer this path
];

export default function SafeCategoryImage({
  src,
  slug,
  alt,
  width = 1200,
  height = 900,
  priority = false,
  className,
}: Props) {
  // Build a list of candidate sources to try in order
  const candidates = useMemo(() => {
    const list: string[] = [];

    if (src) {
      list.push(src);
      // try alternate extensions for the same basename
      if (/\.jpe?g$/i.test(src)) {
        list.push(src.replace(/\.jpe?g$/i, ".png"));
        list.push(src.replace(/\.jpe?g$/i, ".webp"));
      } else if (/\.png$/i.test(src)) {
        list.push(src.replace(/\.png$/i, ".jpg"));
        list.push(src.replace(/\.png$/i, ".webp"));
      } else if (/\.webp$/i.test(src)) {
        list.push(src.replace(/\.webp$/i, ".jpg"));
        list.push(src.replace(/\.webp$/i, ".png"));
      }
    } else if (slug) {
      // default pattern if you only know the slug
      list.push(`/images/categories/${slug}/card.jpg`);
      list.push(`/images/categories/${slug}/card.png`);
      list.push(`/images/categories/${slug}/card.webp`);
    }

    return [...list, ...GLOBAL_FALLBACKS];
  }, [src, slug]);

  const [idx, setIdx] = useState(0);

  return (
    <Image
      src={candidates[idx]}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => {
        if (idx < candidates.length - 1) setIdx((i) => i + 1);
      }}
    />
  );
}
