'use client';

import Link from 'next/link';
import * as React from 'react';

export default function DescriptionClamp({
  text,
  maxChars = 160,
  href,
}: {
  text: string;
  maxChars?: number;
  href: string;
}) {
  const clean = (text || '').trim();
  if (!clean) return null;

  const needs = clean.length > maxChars;
  const teaser = needs ? clean.slice(0, maxChars).trimEnd() : clean;
  const rest = needs ? clean.slice(maxChars) : '';

  return (
    <div className="text-[15px] leading-relaxed text-gray-700">
      <p className="whitespace-pre-line">
        {teaser}
        {needs && '… '}
        {needs && (
          <Link href={href} className="text-blue-700 hover:underline">
            Read more
          </Link>
        )}
      </p>
      {/* If you prefer the expandable inline block instead of linking to PDP:
      {needs && (
        <details className="mt-1">
          <summary className="inline cursor-pointer text-blue-700 hover:underline">More</summary>
          <div className="mt-2 whitespace-pre-line">{rest}</div>
        </details>
      )} */}
    </div>
  );
}
