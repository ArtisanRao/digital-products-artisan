// app/thank-you/page.tsx
export default function ThankYou() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Thank you! ðŸŽ‰</h1>
      <p className="mt-3 text-gray-700">
        Your payment was successful. A receipt and download link will be emailed to you.
      </p>
      <a href="/products" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
        Back to Products
      </a>
    </main>
  );
}
