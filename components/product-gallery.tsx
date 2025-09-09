"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const safeImages = images?.length ? images : ["/placeholder.svg"]
  const [index, setIndex] = useState(0)

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length),
    [safeImages.length]
  )
  const next = useCallback(
    () => setIndex((i) => (i + 1) % safeImages.length),
    [safeImages.length]
  )

  return (
    <div className="flex gap-4">
      {/* Thumbnails (left) */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {safeImages.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i)} // open in main preview only
            className={`relative w-16 h-16 rounded-md border transition-all ${
              i === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            } hover:shadow`}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} - preview ${i + 1}`}
              fill
              sizes="64px"
              className="object-contain rounded-md bg-white transition-transform duration-300 hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* Main preview (with stronger hover + prev/next controls) */}
      <div
        className="group relative flex-1 aspect-[4/3] overflow-hidden rounded-md bg-white"
        tabIndex={0}
        role="group"
        aria-label="Product image gallery"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev()
          if (e.key === "ArrowRight") next()
        }}
      >
        <Image
          src={safeImages[index]}
          alt={alt}
          fill
          sizes="(min-width:768px) 50vw, 100vw"
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          priority
        />

        {/* Prev */}
        {safeImages.length > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next */}
        {safeImages.length > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 hover:bg-black/60 text-white p-2 opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
