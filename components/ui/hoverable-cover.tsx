"use client";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  ratio?: "16/9" | "3/2" | "4/3" | "1/1";
  fit?: "contain" | "cover";
  sizes?: string;
  className?: string;
};

const ratioMap = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
} as const;

export default function HoverableCover({
  src,
  alt,
  ratio = "16/9",
  fit = "contain",
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  className = "",
}: Props) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden bg-white p-2 rounded-xl group",
        ratioMap[ratio],
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        draggable={false}
        className={[
          fit === "cover" ? "object-cover" : "object-contain",
          "transition-transform duration-300 group-hover:scale-[1.03]",
        ].join(" ")}
      />
      {/* subtle overlay + ring on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10 rounded-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />
      </div>
    </div>
  );
}
