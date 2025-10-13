'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Props = {
  images: string[];
  alt?: string;
  /** How many EXTRA thumbnails (beyond the first/cover) to show before revealing the rest */
  maxThumbs?: number; // default 4 extras => cover + 4
};

export default function ProductGallery({
  images,
  alt = 'Product image',
  maxThumbs = 4,
}: Props) {
  const cap = Math.max(0, Math.floor(Number.isFinite(maxThumbs) ? maxThumbs : 4));

  // Dedupe + fallback
  const safe = React.useMemo<string[]>(
    () =>
      Array.isArray(images) && images.length
        ? Array.from(new Set(images.filter(Boolean)))
        : ['/images/placeholder-cover.jpg'],
    [images]
  );

  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  const len = safe.length;

  // When collapsed, show: cover (1) + extras (cap)
  const collapsedCount = Math.min(len, 1 + cap);
  const hasMore = len > collapsedCount;
  const visibleCount = showAll ? len : collapsedCount;

  const thumbs = React.useMemo(() => safe.slice(0, visibleCount), [safe, visibleCount]);

  const prev = React.useCallback(() => {
    setIndex(i => (i - 1 + len) % len);
  }, [len]);

  const next = React.useCallback(() => {
    setIndex(i => (i + 1) % len);
  }, [len]);

  // Preload neighbors
  const loaded = React.useRef<Set<number>>(new Set());
  const preload = React.useCallback(
    (idxs: number[]) => {
      if (typeof window === 'undefined') return;
      idxs.forEach(i => {
        const j = ((i % len) + len) % len; // clamp
        if (!loaded.current.has(j) && safe[j]) {
          const img = new window.Image();
          img.src = safe[j]!;
          loaded.current.add(j);
        }
      });
    },
    [safe, len]
  );

  React.useEffect(() => {
    loaded.current.clear();
    if (!len) return;
    preload([0, 1, 2]);
  }, [len, preload]);

  React.useEffect(() => {
    if (!len) return;
    preload([index - 1, index + 1]);
  }, [index, len, preload]);

  React.useEffect(() => {
    if (index >= len) setIndex(0);
  }, [len, index]);

  React.useEffect(() => {
    if (!showAll && index >= visibleCount) setIndex(Math.max(0, visibleCount - 1));
  }, [showAll, visibleCount, index]);

  // Keyboard support in fullscreen
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

  const current = safe[index] ?? safe[0];

  // Auto-scroll active thumb into view
  const railRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = railRef.current?.querySelector<HTMLButtonElement>(`[data-i="${index}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [index, visibleCount]);

  return (
    <>
      {/* Key layout fixes:
         - self-start on the viewer so it aligns to the very top (kills the “A” gap)
         - explicit aspect ratio container so no white band appears above the image
      */}
      <div className="grid grid-cols-[80px,1fr] sm:grid-cols-[96px,1fr] gap-4 w-full items-start">
        {/* Thumbnails */}
        <div
          ref={railRef}
          className="flex flex-col gap-3 w-20 sm:w-24 sticky top-4 self-start z-20 max-h-[75vh] overflow-auto pr-1"
          role="listbox"
          aria-label="Product images"
        >
          {thumbs.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={src + i}
                data-i={i}
                onClick={() => setIndex(i)}
                className={[
                  'relative aspect-square overflow-hidden rounded-md border transition ring-offset-2 cursor-pointer',
                  active ? 'ring-2 ring-blue-600 border-blue-200' : 'border-gray-200',
                ].join(' ')}
                aria-selected={active}
                aria-label={`Show image ${i + 1}`}
                title={`Show image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-200 ease-out hover:scale-105"
                />
              </button>
            );
          })}

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              className="mt-1 w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-expanded={showAll}
              aria-label={showAll ? 'Show fewer images' : 'Show more images'}
            >
              {showAll ? 'Less' : 'More'}
            </button>
          )}
        </div>

        {/* Main viewer */}
        <div className="relative w-full max-w-full overflow-hidden rounded-lg border bg-white self-start">
          {/* Aspect lock so there’s no blank band above the image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
            {/* Expand (moved to the RIGHT) */}
            <button
              onClick={() => setOpen(true)}
              className="absolute top-3 right-3 z-30 inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/90 shadow-md hover:bg-white transition-transform hover:scale-105"
              aria-label="Open fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Prev / Next (hug left/right edges) */}
            {len > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center rounded-full w-11 h-11 bg-neutral-800/90 text-white shadow-md hover:bg-neutral-900 focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center rounded-full w-11 h-11 bg-neutral-800/90 text-white shadow-md hover:bg-neutral-900 focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Main image (subtle hover zoom-out effect) */}
            <Image
              key={current}
              src={current}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-contain transition-transform duration-200 ease-out hover:scale-[1.02]"
              priority
            />
          </div>
        </div>
      </div>

      {/* FULLSCREEN viewer */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="z-[100] p-0 bg-transparent border-none shadow-none max-w-none w-screen h-screen"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">Fullscreen preview</DialogDescription>

          <div className="relative w-full h-full bg-black/80 flex items-center justify-center">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-white/95 text-gray-800 shadow-lg hover:bg-white"
              aria-label="Close fullscreen"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Prev / Next in fullscreen */}
            {len > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-neutral-800/90 text-white shadow-lg hover:bg-neutral-900 focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-neutral-800/90 text-white shadow-lg hover:bg-neutral-900 focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative max-w-[95vw] max-h-[85vh] w-auto h-auto">
              <Image
                key={`fs-${current}`}
                src={current}
                alt={alt}
                width={1800}
                height={1400}
                sizes="95vw"
                className="w-auto max-w-[95vw] h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
