"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // This logs on the server where Vercel captures it.
    // You’ll see the real message/stack in your Function Logs.
    console.error("PDP error:", {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
    });
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold">We hit a snag loading this product</h1>
      <p className="mt-2 text-gray-600">
        Try{" "}
        <button
          type="button"
          onClick={() => reset()}
          className="underline underline-offset-4 decoration-2"
        >
          reloading this page
        </button>{" "}
        or{" "}
        <Link href="/products" className="underline underline-offset-4 decoration-2">
          browse all products
        </Link>
        .
      </p>
      {error?.digest && (
        <p className="mt-3 text-xs text-gray-500">Error digest: {error.digest}</p>
      )}
    </main>
  );
}
