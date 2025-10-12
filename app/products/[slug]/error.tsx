'use client';

import React from 'react';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Product page error</h1>
      <p className="text-gray-600 mt-2">
        We couldn’t render this product. You can retry or go back.
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
        <a href="/products" className="rounded border px-4 py-2">
          All products
        </a>
      </div>
    </div>
  );
}
