"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X as CloseIcon,
} from "lucide-react";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
};

export default function ProductGallery({ images, alt = "Product image", className = "" }: Props) {
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startXRef = React.useRef<number | null>(null);

  const len = images?.length ?? 0;
  const goPrev = React.useCallback(() => setIndex((i) => (i - 1 + len) % len), [len]);
  const goNext = React.useCallback(() => setIndex((i) => (i + 1) % len), [len]);

  // ---- Lightbox open/close + history/back-button handling ----
  const closeLightbox = React.useCallback(() => {
    setOpen(false);
    // Restore scroll
    try { document.body.style.overflow = ""; } catch {}
    // If we pushed a state for the lightbox, a back() will pop only that.
    if (typeof window !== "undefined" && window.location.hash === "#!lightbox") {
      // Use replace to avoid going “far back” if user opened directly on PDP
      history.replaceState({}, "", window.location.pathname + window.location.search);
    }
  }, []);

  const openLightbox = () => {
    setOpen(true);
    // Lock scroll
    try { document.body.style.overflow = "hidden"; } catch {}
    // Push lightweight state so hardware back closes the overlay, not the page
    try {
      history.replaceState({ ...history.state }, "", window.location.pathname + window.location.search);
      history.pushState({ lightbox: true }, "", "#!lightbox");
    } catch {}
  };

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    const onPop = () => {
      // User pressed hardware back — close instead of navigating away
      if (open) closeLightbox();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [open, goPrev, goNext, closeLightbox]);

  // ---- Touch swipe for overlay ----
  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = startXRef.current;
    if (start == null) return;
    const endX = e.changedTouches[0]?.clientX ?? start;
    const delta = endX - start;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goPrev() : goNext();
    }
    startXRef.current = null;
  };

  return (
    <div className={`grid grid-cols-[80px_1fr] gap-3 md:gap-4 ${className}`}>
      {/* Thumbs (scrollable) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setIndex(i)}
            className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden ring-1 ring-black/5
              ${i === index ? "outline outline-2 outline-blue-600" : ""}`}
            aria-label={`Thumbnail ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main preview with clickable prev/next + expand button */}
      <div className="relative w-full overflow-hidden rounded-lg border border-black/5 bg-white">
        {/* Prev/Next (NOW also clickable on the page preview) */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2
                     bg-blue-600 text-white hover:bg-blue-700 shadow-lg ring-1 ring-white/70"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2
                     bg-blue-600 text-white hover:bg-blue-700 shadow-lg ring-1 ring-white/70"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Expand button */}
        <button
          onClick={openLightbox}
          aria-label="Open full-screen preview"
          className="absolute right-2 top-2 z-10 rounded-full p-2 bg-white/90 hover:bg-white
                     shadow-md ring-1 ring-black/10"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Main image (tap anywhere also opens) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className="block w-full h-auto object-contain max-h-[70vh] cursor-zoom-in"
          onClick={openLightbox}
        />
      </div>

      {/* LIGHTBOX OVERLAY */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-[2px] flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close “X” (safe-area aware) */}
          <button
            aria-label="Close preview"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="fixed top-[max(12px,env(safe-area-inset-top))] right-[max(12px,env(safe-area-inset-right))]
                       rounded-full p-2 bg-white/95 hover:bg-white shadow-lg ring-1 ring-black/10"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {/* Prev/Next inside overlay */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 rounded-full p-3
                       bg-blue-600 text-white hover:bg-blue-700 shadow-xl ring-1 ring-white/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 rounded-full p-3
                       bg-blue-600 text-white hover:bg-blue-700 shadow-xl ring-1 ring-white/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image container (clicking image won't close; click backdrop to close) */}
          <div
            className="relative max-w-[min(96vw,1200px)] max-h-[88vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${alt} enlarged ${index + 1}`}
              className="max-w-full max-h-full w-auto h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
