// components/ui/hoverable-cover.tsx
"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  src: string;
  /** Optional extra candidates to try, in order */
  fallbacks?: string[];
  alt: string;
  ratio?: "16/9" | "3/2" | "4/3" | "1/1";
  fit?: "cover" | "contain";
  className?: string;
  paddingClass?: string;
  roundedClass?: string;
  sizes?: string;
  hover?: boolean;
};

const ratioClass = (r: Props["ratio"]) => {
  switch (r) {
    case "1/1":
      return "aspect-[1/1]";
    case "3/2":
      return "aspect-[3/2]";
    case "4/3":
      return "aspect-[4/3]";
    default:
      return "aspect-[16/9]";
  }
};

export default function HoverableCover({
  src,
  fallbacks = [],
  alt,
  ratio = "16/9",
  fit = "contain",
  className = "",
  paddingClass = "p-2",
  roundedClass = "rounded-md",
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  hover = true,
}: Props) {
  const candidates = React.useMemo(() => {
    const all = Array.from(new Set([src, ...fallbacks].filter(Boolean)));
    // Always end with a placeholder
    all.push("/images/placeholder-cover.jpg");
    return all;
  }, [src, fallbacks]);

  const [idx, setIdx] = React.useState(0);
  const current = candidates[idx];

  const handleError = () => {
    setIdx((i) => (i < candidates.length - 1 ? i + 1 : i));
  };

  return (
    <div
      className={[
        "relative w-full overflow-hidden bg-white",
        ratioClass(ratio),
        roundedClass,
        className,
      ].join(" ")}
    >
      <div className={`absolute inset-0 ${paddingClass}`}>
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes={sizes}
          draggable={false}
          loading="lazy"
          onError={handleError}
        />
      </div>

      {/* Hover overlay */}
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          hover ? "group-hover:opacity-100" : "",
        ].join(" ")}
      >
        <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10 rounded-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />
      </div>
    </div>
  );
}
