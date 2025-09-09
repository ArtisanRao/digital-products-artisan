"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const safeImages = images?.length ? images : ["/placeholder.svg"]
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  // Lock background scroll when lightbox is open
  useEffect(() => {
    if (open) {
      const orig = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [open])

  // Keyboard controls in lightbox
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % safeImages.length)
        setZoomed(false)
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
        setZoomed(false)
      }
    },
    [open, safeImages.length]
  )

  useEffect(() => {
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onKey])

  return (
    <div className="flex gap-4">
      {/* Thumbnails (left) */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {safeImages.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => {
              setIndex(i)
              setOpen(true) // open on thumb click (Etsy-like)
              setZoomed(false)
            }}
            className={`relative w-16 h-16 rounded-md border ${
              i === index ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
            } hover:shadow transition-shadow`}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} - preview ${i + 1}`}
              fill
              className="object-contain rounded-md bg-white transition-transform duration-300 hover:scale-105"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main image (click to open lightbox) */}
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setZoomed(false)
        }}
        className="group relative flex-1 aspect-[4/3] overflow-hidden rounded-md bg-white cursor-zoom-in"
        aria-label="Open image zoom"
      >
        <Image
          src={safeImages[index]}
          alt={alt}
          fill
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(min-width:768px) 50vw, 100vw"
          priority
        />
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-[92vw] max-w-5xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[index]}
              alt={alt}
              fill
              sizes="90vw"
              className={`rounded-lg object-contain transition-transform duration-300 ${
                zoomed ? "scale-110" : "scale-100"
              }`}
              priority
            />

            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev/Next */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => {
                    setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
                    setZoomed(false)
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => {
                    setIndex((i) => (i + 1) % safeImages.length)
                    setZoomed(false)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Click anywhere inside to toggle mild zoom */}
            <button
              type="button"
              aria-label="Toggle zoom"
              className="absolute inset-0 cursor-zoom-in"
              onClick={() => setZoomed((z) => !z)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
