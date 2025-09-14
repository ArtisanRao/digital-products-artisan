"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  /** Primary src (optional if you pass srcs) */
  src?: string;
  /** Candidate paths to try in order (we'll append a placeholder automatically at the end) */
  srcs?: string[];
  alt: string;
  /** "16/9" (default) | "3/2" | "1/1" */
  ratio?: "16/9" | "3/2" | "1/1";
  /** "contain" (default) | "cover" */
  fit?: "contain" | "cover";
  className?: string;
  paddingClass?: string;
  roundedClass?: string;
  sizes?: string;
};

export default function HoverableCover({
  src,
  srcs,
  alt,
  ratio = "16/9",
  fit = "contain",
  className,
  paddingClass = "p-2",
  roundedClass = "rounded-xl",
  sizes = "100vw",
}: Props) {
  const candidates = React.useMemo(() => {
    const list = [
      ...(src ? [src] : []),
      ...(srcs ?? []),
      "/images/placeholder-cover.jpg",
    ];
    // De-dupe while preserving order
    return Array.from(new Set(list));
  }, [src, srcs]);

  const [idx, setIdx] = React.useState(0);
  const current = candidates[Math.min(idx, candidates.length - 1)];

  const onError = () => setIdx((i) => Math.min(i + 1, candidates.length - 1));

  const aspect =
    ratio === "1/1" ? "aspect-square" : ratio === "3/2" ? "aspect-[3/2]" : "aspect-video";
  const object = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className={cn("relative w-full overflow-hidden bg-white group", roundedClass, className)}>
      <div className={cn("relative w-full", aspect, paddingClass)}>
        <Image
          src={current}
          alt={alt}
          fill
          className={cn(object, "transition-transform duration-300 group-hover:scale-[1.03]")}
          sizes={sizes}
          draggable={false}
          onError={onError}
        />
        {/* Subtle hover treatment */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10 rounded-md" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
