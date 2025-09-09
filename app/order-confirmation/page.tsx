import Link from "next/link";

export const dynamic = "force-dynamic"; // show immediately after redirect

export default function OrderConfirmation({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  // Optionally: verify session_id with Stripe server-side before showing
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Thank you! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Your payment was completed successfully.
      </p>
      <div className="space-x-3">
        <Link
          href="/products"
          className="inline-block px-4 py-2 rounded-md border hover:bg-gray-50"
        >
          Continue shopping
        </Link>
        <Link
          href="/support"
          className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Need help?
        </Link>
      </div>
    </main>
  );
}
