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

type Props = { images: string[]; alt?: string };
const PLACEHOLDER = '/images/placeholder-cover.jpg';

export default function ProductGallery({ images, alt = 'Product image' }: Props) {
  const safeImages = React.useMemo(
    () => (images?.filter(Boolean)?.length ? images.filter(Boolean) : [PLACEHOLDER]),
    [images]
  );

  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const len = safeImages.length;
  const prev = React.useCallback(() => setIndex(i => (i - 1 + len) % len), [len]);
  const next = React.useCallback(() => setIndex(i => (i + 1) % len), [len]);

  // Preload neighbors
  const loaded = React.useRef<Set<number>>(new Set());
  const preload = React.useCallback((idxs: number[]) => {
    if (typeof window === 'undefined') return;
    idxs.forEach(i0 => {
      const i = ((i0 % len) + len) % len;
      if (!loaded.current.has(i)) {
        const img = new window.Image();
        img.src = safeImages[i];
        loaded.current.add(i);
      }
    });
  }, [safeImages, len]);
  React.useEffect(() => { if (len) preload([0,1,2]); }, [len, preload]);
  React.useEffect(() => { if (len) preload([index-1, index+1]); }, [index, len, preload]);

  // Keyboard in fullscreen
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

  const current = safeImages[index] ?? PLACEHOLDER;

  return (
    <>
      <div className="grid w-full items-start gap-4 grid-cols-[80px,1fr] sm:grid-cols-[96px,1fr] relative z-0 product-gallery-block">
        {/* Thumbnails */}
        <div className="sticky top-4 z-10 w-20 sm:w-24 self-start flex flex-col gap-3 pointer-events-auto">
          {safeImages.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                className={[
                  'relative aspect-square overflow-hidden rounded-md border transition ring-offset-2',
                  active ? 'ring-2 ring-blue-600 border-blue-200' : 'hover:shadow-sm border-gray-200',
                ].join(' ')}
                aria-label={`Show image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  onError={(e) => { (e.currentTarget as any).src = PLACEHOLDER; }}
                />
              </button>
            );
          })}
        </div>

        {/* Main viewer — IMPORTANT: ignore pointer events by default */}
        <div className="relative w-full max-w-full overflow-hidden rounded-lg border bg-white pointer-events-none">
          {/* Fullscreen trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white pointer-events-auto"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          {/* Prev / Next */}
          {len > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/90 text-white shadow-md hover:bg-neutral-900 focus:outline-none pointer-events-auto"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-800/90 text-white shadow-md hover:bg-neutral-900 focus:outline-none pointer-events-auto"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="w-full">
            <Image
              key={current}
              src={current}
              alt={alt}
              width={1600}
              height={1200}
              className="h-auto w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
              loading="eager"
              priority
              onError={(e) => { (e.currentTarget as any).src = PLACEHOLDER; }}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen dialog unchanged */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="z-[100] h-screen w-screen max-w-none border-none bg-transparent p-0 shadow-none" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">Fullscreen preview</DialogDescription>

          <div className="relative flex h-full w-full items-center justify-center bg-black/80">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg hover:bg-white"
              aria-label="Close fullscreen"
            >
              <X className="h-7 w-7" />
            </button>

            {len > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 z-[120] -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/90 text-white shadow-lg hover:bg-neutral-900 focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 z-[120] -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/90 text-white shadow-lg hover:bg-neutral-900 focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="relative h-auto w-auto max-h-[85vh] max-w-[95vw]">
              <Image
                key={`fs-${current}`}
                src={current}
                alt={alt}
                width={1800}
                height={1400}
                className="h-auto w-auto max-h-[85vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
                loading="eager"
                priority
                onError={(e) => { (e.currentTarget as any).src = PLACEHOLDER; }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
