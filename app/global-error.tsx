'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Something went wrong
        </h1>
        <p style={{ color: '#6b7280' }}>
          This is a global error boundary. You can retry or go back.
        </p>

        <pre
          style={{
            marginTop: 16,
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 12,
            whiteSpace: 'pre-wrap',
          }}
        >
{String(error?.message || 'Unknown client error')}
{error?.digest ? `\n\ndigest: ${error.digest}` : ''}
        </pre>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '8px 12px',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 8,
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
