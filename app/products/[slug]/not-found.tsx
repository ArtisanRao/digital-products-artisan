export default function ProductNotFound() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <p className="mt-2 text-gray-700">
        We couldn’t find that product. It may have been moved or renamed.
      </p>
      <a href="/products" className="mt-4 inline-block underline">
        Browse all products →
      </a>
    </main>
  );
}
