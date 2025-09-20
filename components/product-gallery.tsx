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
};

export default function ProductGallery({ images, alt = 'Product image' }: Props) {
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const len = images.length;

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);

  // ---- SPEED: Preload neighbors (and first few on mount) ----
  const loaded = React.useRef<Set<number>>(new Set());

  const preload = React.useCallback(
    (idxs: number[]) => {
      idxs.forEach((i) => {
        const j = ((i % len) + len) % len; // clamp
        if (!loaded.current.has(j)) {
          const img = new window.Image();
          img.src = images[j];
          loaded.current.add(j);
        }
      });
    },
    [images, len]
  );

  // Preload first 3 on mount
  React.useEffect(() => {
    if (typeof window === 'undefined' || !len) return;
    preload([0, 1, 2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  // Always keep neighbors warm
  React.useEffect(() => {
    if (typeof window === 'undefined' || !len) return;
    preload([index - 1, index + 1]);
  }, [index, len, preload]);

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

  const current = images[index] ?? images[0];

  return (
    <>
      <div className="grid grid-cols-[80px,1fr] sm:grid-cols-[96px,1fr] gap-4 w-full items-start">
        {/* Thumbnails */}
        <div className="flex flex-col gap-3 w-20 sm:w-24 sticky top-4 self-start z-20">
          {images.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={src + i}
                onClick={() => setIndex(i)}
                className={[
                  'relative aspect-square overflow-hidden rounded-md border transition ring-offset-2',
                  active
                    ? 'ring-2 ring-blue-600 border-blue-200'
                    : 'hover:shadow-sm border-gray-200',
                ].join(' ')}
                aria-label={`Show image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Main image / viewer */}
        <div className="relative w-full max-w-full overflow-hidden rounded-lg border bg-white">
          {/* Expand */}
          <button
            onClick={() => setOpen(true)}
            className="absolute top-3 right-3 z-30 inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/90 shadow-md hover:bg-white"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Prev / Next on page */}
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

          {/* Main image: eager + priority for instant paint */}
          <div className="w-full">
            <Image
              key={current}                // ensure swap without reusing node
              src={current}
              alt={alt}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain"
              loading="eager"
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
                className="w-auto max-w-[95vw] h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                loading="eager"
                priority
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
