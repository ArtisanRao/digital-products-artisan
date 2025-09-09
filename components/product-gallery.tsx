"use client"

import Image from "next/image"
import { useState } from "react"

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [index, setIndex] = useState(0)
  const safeImages = images.length ? images : ["/placeholder.svg"]

  return (
    <div className="flex gap-4">
      {/* Thumbnails (left) */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {safeImages.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i)}
            className={`relative w-16 h-16 rounded-md border ${
              i === index ? "border-blue-600" : "border-gray-200"
            } hover:shadow`}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} - preview ${i + 1}`}
              fill
              className="object-contain rounded-md bg-white"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-[4/3] overflow-hidden rounded-md bg-white">
        <Image
          src={safeImages[index]}
          alt={alt}
          fill
          className="object-contain"
          sizes="(min-width:768px) 50vw, 100vw"
          priority
        />
      </div>
    </div>
  )
}
