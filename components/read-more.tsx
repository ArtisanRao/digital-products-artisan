'use client';
import * as React from 'react';

type Props = {
  text: string;
  lines?: number;          // how many lines to show before "Read more"
  threshold?: number;      // show toggle only if length > threshold
  className?: string;
};

const clampStyle = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties);

export default function ReadMore({
  text,
  lines = 3,
  threshold = 160,
  className,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = (text || '').length > threshold;

  return (
    <div className={className}>
      <p
        className="text-gray-600"
        style={!expanded ? clampStyle(lines) : undefined}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-blue-600 hover:underline font-medium"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
