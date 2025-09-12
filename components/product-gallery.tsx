'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

type Props = {
  images: string[];
  alt?: string;
};

export default function ProductGallery({ images, alt = 'Product image' }: Props) {
  const pics = images?.length ? images : ['/placeholder.svg'];
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + pics.length) % pics.length),
    [pics.length]
  );
  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % pics.length),
    [pics.length]
  );

  // Disable body scroll when lightbox is open
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keyboard controls inside lightbox
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  // Basic swipe support in lightbox
  const touch = React.useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    if (Math.abs(dx) > 40) (dx > 0 ? prev : next)();
    touch.current = null;
  };

  return (
    <>
      {/* Gallery layout: thumbnails (left) + main image */}
      <div className="grid grid-cols-[76px_1fr] gap-3">
        {/* Thumbnails */}
        <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pr-1">
          {pics.map((src, i) => {
            const selected = i === index;
            return (
              <button
                key={src + i}
                onClick={() => setIndex(i)}
                className={`relative w-[72px] h-[72px] rounded-md overflow-hidden bg-white ring-1 ring-gray-200 hover:ring-blue-300 ${
                  selected ? 'ring-2 ring-blue-500' : ''
                }`}
                aria-label={`Show image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="72px"
                  className="object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>

        {/* Main image */}
        <div className="relative w-full max-w-full overflow-hidden rounded-lg bg-white">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={pics[index]}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain select-none"
              priority
              draggable={false}
            />
            {/* Expand button (also clicking the image will open) */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Expand image"
              className="absolute right-3 top-3 inline-flex items-center justify-center rounded-md bg-black/50 p-2 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-zoom-in"
              title="View larger"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Prev/Next controls (desktop & mobile) */}
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Click main image area to open too */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open full-screen preview"
              className="absolute inset-0 cursor-zoom-in"
            />
          </div>
        </div>
      </div>

      {/* Lightbox / Full-screen viewer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Centered stage */}
          <div
            className="flex h-full w-full items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative h-full w-full">
              <Image
                src={pics[index]}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain select-none"
                priority
                draggable={false}
              />

              {/* Nav in lightbox */}
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
