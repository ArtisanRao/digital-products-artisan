'use client';

import Image from 'next/image';
import * as React from 'react';

type Props = {
  src: string;
  alt: string;
  /** Common ratios you use */
  ratio?: '16/9' | '3/2' | '1/1' | '4/5';
  /** How the image should fit in the frame */
  fit?: 'contain' | 'cover';
  /** Tailwind classes for rounding/padding if you want to tweak per-usage */
  roundedClass?: string;
  paddingClass?: string;
  /** Responsive sizes hint for Next/Image */
  sizes?: string;
  /** Set to false to disable hover animations */
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
  alt,
  ratio = '16/9',
  fit = 'contain',
  roundedClass = 'rounded-2xl',
  paddingClass = 'p-2',
  sizes = '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw',
  hover = true,
}: Props) {
  const ratioClass = RATIO_CLASS[ratio] ?? RATIO_CLASS['16/9'];
  const objectClass = fit === 'cover' ? 'object-cover' : 'object-contain';

  // Make the component self-sufficient: it provides its own `.group`
  const groupClass = hover ? 'group' : '';

  return (
    <div className={`relative w-full bg-white ${roundedClass} ${paddingClass} ${groupClass}`}>
      <div className={`relative w-full ${ratioClass} overflow-hidden ${roundedClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          draggable={false}
          className={`${objectClass} transition-transform duration-300 ${hover ? 'group-hover:scale-[1.03]' : ''}`}
        />
        {hover && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
