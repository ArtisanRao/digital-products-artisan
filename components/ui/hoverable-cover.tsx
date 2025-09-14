// components/ui/hoverable-cover.tsx
"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  /** You can pass either a full filename (with extension) OR a base path without extension. */
  src: string;
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

const IMG_EXTS = ["jpg", "jpeg", "png", "webp", "avif", "JPG", "JPEG", "PNG", "WEBP", "AVIF"];

function stripExt(p: string) {
  const i = p.lastIndexOf(".");
  if (i === -1) return p;
  return p.slice(0, i);
}

function hasExt(p: string) {
  return /\.[a-zA-Z0-9]+$/.test(p);
}

function expandCandidates(src: string) {
  // Normalize: try both icons/Icons, with/without "-cover", and "…/cover" folder
  const bases = new Set<string>();
  const s0 = hasExt(src) ? stripExt(src) : src;

  const withCover = s0.endsWith("-cover") ? s0 : `${s0}-cover`;
  const withoutCover = s0.replace(/-cover$/i, "");
  const asFolder = `${withoutCover}/cover`;

  const variants = [s0, withCover, withoutCover, asFolder];

  for (const v of variants) {
    bases.add(v);
    if (v.startsWith("/images/icons/")) bases.add(v.replace("/images/icons/", "/images/Icons/"));
    if (v.startsWith("/images/Icons/")) bases.add(v.replace("/images/Icons/", "/images/icons/"));
  }

  const withExts: string[] = [];
  for (const b of bases) {
    if (hasExt(src)) {
      // If the original had an extension, try that exact one first.
      withExts.push(`${b}${src.slice(stripExt(src).length)}`);
    }
    for (const e of IMG_EXTS) withExts.push(`${b}.${e}`);
  }

  // Ensure uniqueness and filter out empties
  const uniq = Array.from(new Set(withExts.filter(Boolean)));
  // Always end with placeholder
  uniq.push("/images/placeholder-cover.jpg");
  return uniq;
}

export default function HoverableCover({
  src,
  alt,
  ratio = "16/9",
  fit = "contain",
  className = "",
  paddingClass = "p-2",
  roundedClass = "rounded-md",
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  hover = true,
}: Props) {
  const candidates = React.useMemo(() => expandCandidates(src), [src]);
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
