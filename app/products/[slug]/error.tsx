"use client";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[product error boundary]", error);
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Product page error</h1>
      <p className="mt-2 text-gray-700">
        Something went wrong while loading this product.
      </p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => reset()} className="rounded border px-3 py-1">
          Try again
        </button>
        <a href="/products" className="underline">
          All products
        </a>
      </div>
    </main>
  );
}
