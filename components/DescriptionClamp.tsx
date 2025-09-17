'use client';

import * as React from 'react';
import Link from 'next/link';

type Props = {
  text: string;
  maxChars?: number;
  className?: string;
  /** Optional link to the full details page; shown as a CTA when collapsed */
  href?: string;
  moreLabel?: string;
  lessLabel?: string;
};

export default function DescriptionClamp({
  text,
  maxChars = 160,
  className = '',
  href,
  moreLabel = 'More',
  lessLabel = 'Show less',
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const safe = (text ?? '').toString().trim();
  if (!safe) return null;

  const needsToggle = safe.length > maxChars;
  const preview = needsToggle ? safe.slice(0, maxChars).trimEnd() + '…' : safe;

  return (
    <div className={className}>
      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
        {expanded ? safe : preview}
      </p>

      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm font-medium text-blue-700 hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}

      {/* Optional CTA to full page when collapsed */}
      {!expanded && href && (
        <Link href={href} className="ml-3 text-sm text-blue-700 hover:underline">
          Full details
        </Link>
      )}
    </div>
  );
}
