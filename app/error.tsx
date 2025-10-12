'use client';

import React from 'react';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold">Page error</h1>
      <p className="text-gray-600 mt-2">
        An issue occurred while rendering this page.
      </p>

      <details className="mt-4 whitespace-pre-wrap p-3 bg-gray-50 border rounded">
        <summary className="cursor-pointer">Error details</summary>
        {String(error?.message || 'Unknown client error')}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
      </details>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => reset()}
          className="rounded bg-blue-600 text-white px-4 py-2"
        >
          Try again
        </button>
        <a href="/" className="rounded border px-4 py-2">
          Go home
        </a>
      </div>
    </div>
  );
}
