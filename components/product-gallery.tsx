'use client';

import * as React from 'react';

type Props = {
  images: string[];
  alt?: string;
};

export default function ProductGallery({ images, alt = '' }: Props) {
  const [index, setIndex] = React.useState(0);
  const current = images?.[index] ?? images?.[0];

  if (!images?.length) return null;

  return (
    <div className="product-gallery w-full max-w-full overflow-hidden">
      {/* On mobile it's a single column; on md+ it becomes [thumbs | main] */}
      <div className="grid gap-3 md:grid-cols-[88px_1fr] items-start max-w-full">
        {/* Main image (first on mobile) */}
        <div className="order-1 md:order-2 w-full max-w-full">
          <div className="w-full max-w-full overflow-hidden rounded-lg bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={alt}
              className="block w-full h-auto object-contain"
              loading="eager"
            />
          </div>
        </div>

        {/* Thumbnails: horizontal rail on mobile, vertical column on md+ */}
        <div className="order-2 md:order-1 w-full md:w-auto">
          <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-x-visible">
            {images.map((src, i) => {
              const isActive = i === index;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={[
                    'relative shrink-0 rounded-md border transition',
                    'w-20 h-28 md:w-20 md:h-28', // fixed thumb size
                    isActive
                      ? 'ring-2 ring-blue-600 border-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  ].join(' ')}
                  aria-label={`Show image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
