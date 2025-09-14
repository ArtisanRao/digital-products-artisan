'use client';

import Image from 'next/image';
import * as React from 'react';

type Props = {
  /** Primary image to try first */
  src: string;
  /** Optional list of alternative sources (e.g., PNG if JPG is missing) */
  fallbacks?: string[];
  /** Final fallback if all sources fail */
  placeholderSrc?: string;

  alt: string;
  ratio?: '16/9' | '3/2' | '1/1' | '4/5';
  fit?: 'contain' | 'cover';
  roundedClass?: string;
  paddingClass?: string;
  sizes?: string;
  hover?: boolean;
};

const RATIO_CLASS: Record<NonNullable<Props['ratio']>, string> = {
  '16/9': 'aspect-[16/9]',
  '3/2' : 'aspect-[3/2]',
  '1/1' : 'aspect-square',
  '4/5' : 'aspect-[4/5]',
};

export default function HoverableCover({
  src,
  fallbacks = [],
  placeholderSrc = '/images/placeholder-cover.jpg',
  alt,
  ratio = '16/9',
  fit = 'contain',
  roundedClass = 'rounded-2xl',
  paddingClass = 'p-2',
  sizes = '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw',
  hover = true,
}: Props) {
  const sources = React.useMemo(() => [src, ...fallbacks, placeholderSrc], [src, fallbacks, placeholderSrc]);
  const [idx, setIdx] = React.useState(0);
  const currentSrc = sources[Math.min(idx, sources.length - 1)];

  const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS['16/9'];
  const objectClass = fit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className={`relative w-full ${roundedClass}`}>
      <div
        className={[
          'relative w-full overflow-hidden bg-white',
          roundedClass,
          paddingClass,
          ratioClass,
          'transition-all duration-300',
          hover ? 'hover:shadow-lg hover:ring-2 hover:ring-blue-500/20' : '',
        ].join(' ')}
      >
        <Image
          key={currentSrc} // force rerender when src changes
          src={currentSrc}
          alt={alt}
          fill
          sizes={sizes}
          draggable={false}
          onError={() => setIdx(i => Math.min(i + 1, sources.length - 1))}
          className={[
            objectClass,
            'transition-transform duration-300 will-change-transform',
            hover ? 'hover:scale-105' : '',
          ].join(' ')}
        />

        {hover && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
