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

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Close on Esc when fullscreen
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
      {/* Layout: left thumbnails rail + main image area */}
      <div className="grid grid-cols-[80px,1fr] sm:grid-cols-[96px,1fr] gap-4 w-full items-start">
        {/* Thumbnails (sticky on tall pages) */}
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
                {/* next/image for perf; falls back to <img> if needed */}
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
          {/* Expand button */}
          <button
            onClick={() => setOpen(true)}
            className="absolute top-3 right-3 z-30 inline-flex items-center justify-center rounded-full w-10 h-10 bg-white/90 shadow-md hover:bg-white"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Prev / Next on PAGE (always above the image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center rounded-full w-11 h-11 bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center rounded-full w-11 h-11 bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="w-full">
            <Image
              src={current}
              alt={alt}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain"
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
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-white/95 text-gray-800 shadow-lg hover:bg-white"
              aria-label="Close fullscreen"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Prev / Next in fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[120] inline-flex items-center justify-center rounded-full w-12 h-12 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-[95vw] max-h-[85vh] w-auto h-auto">
              <Image
                src={current}
                alt={alt}
                width={1800}
                height={1400}
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
