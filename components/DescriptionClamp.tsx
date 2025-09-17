'use client';

import * as React from 'react';

type Props = {
  text: string;
  maxChars?: number;          // how much to show before “More”
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
};

export default function DescriptionClamp({
  text,
  maxChars = 160,
  className = '',
  moreLabel = 'More',
  lessLabel = 'Show less',
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const normalized = (text || '').trim();
  const needsToggle = normalized.length > maxChars;
  const preview = needsToggle ? normalized.slice(0, maxChars).trimEnd() + '…' : normalized;

  return (
    <div className={className}>
      <p className="whitespace-pre-line text-gray-700">
        {expanded ? normalized : preview}
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
    </div>
  );
}
