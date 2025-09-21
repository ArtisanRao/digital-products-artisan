"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  ratioClass?: string;     // e.g., "aspect-[3/2]"
  object?: "cover" | "contain"; // default "contain"
};

export default function SimpleGallery({
  images,
  alt,
  className = "",
  ratioClass = "aspect-[3/2]",
  object = "contain",
}: Props) {
  const [idx, setIdx] = useState(0);
  const main = images[idx] ?? images[0];

  return (
    <div className={className}>
      <div className={`relative w-full ${ratioClass}`}>
        <Image
          src={main}
          alt={alt}
          fill
          className={`object-${object}`}
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative aspect-[3/2] rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                i === idx ? "ring-2 ring-blue-500" : ""
              }`}
              aria-label={`Preview ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} preview ${i + 1}`}
                fill
                className="object-contain"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
