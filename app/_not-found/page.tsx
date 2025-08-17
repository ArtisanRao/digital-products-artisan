// File: app/_not-found/page.tsx
'use client';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 text-center">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
}
