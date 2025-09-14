// components/ui/hoverable-cover.tsx
"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  src: string;
  /** Extra candidates to try if `src` 404s (first 200 OK wins) */
  fallbacks?: string[];
  alt: string;
  /** Aspect ratio of the frame */
  ratio?: "16/9" | "3/2" | "4/3" | "1/1";
  /** Image fit behavior inside the frame */
  fit?: "cover" | "contain";
  className?: string;
  paddingClass?: string;
  roundedClass?: string;
  sizes?: string;
  /** Keep default hover overlay; set false to disable */
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
    // unique, non-empty
    return Array.from(new Set([src, ...fallbacks].filter(Boolean)));
  }, [src, fallbacks]);

  const [resolved, setResolved] = React.useState<string>("/images/placeholder-cover.jpg");

  // Probe candidates client side: first HEAD 200 wins
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (res.ok) {
            if (!cancelled) setResolved(url);
            return;
          }
        } catch {
          // keep trying
        }
      }
      if (!cancelled) setResolved("/images/placeholder-cover.jpg");
    })();
    return () => {
      cancelled = true;
    };
  }, [candidates.join("|")]);

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
          src={resolved}
          alt={alt}
          fill
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes={sizes}
          draggable={false}
          priority={false}
        />
      </div>

      {/* Subtle hover overlay + ring */}
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
