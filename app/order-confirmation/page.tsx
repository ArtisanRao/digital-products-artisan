// app/order-confirmation/page.tsx
import Stripe from "stripe";
import Link from "next/link";
import { signDownloadToken } from "@/lib/download-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = { session_id?: string };

function getOrigin() {
  // Prefer your public site URL; fall back to Vercel-provided host
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return fromEnv || "http://localhost:3000";
}

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { session_id } = await searchParams;
  let email: string | null = null;
  let downloadUrl: string | null = null;

  try {
    if (session_id) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      email = session.customer_details?.email ?? null;

      // Only create a link if payment succeeded and we have a product id
      if (session.payment_status === "paid") {
        const productId = Number(session.metadata?.productId) || 0;
        if (productId > 0) {
          // 7-day expiring link
          const token = signDownloadToken({
            pid: productId,
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
          const origin = getOrigin();
          downloadUrl = `${origin}/api/download?token=${token}`;
        }
      }
    }
  } catch (err) {
    console.error("order-confirmation error:", err);
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Thank you!</h1>
      <p className="text-gray-700">
        We received your order{email ? ` for ${email}` : ""}. A receipt has been
        sent{email ? ` to ${email}` : ""}.
      </p>

      {downloadUrl ? (
        <div className="mt-6">
          <a
            href={downloadUrl}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Download your files
          </a>
          <p className="mt-2 text-sm text-gray-500">
            This secure link works for 7 days.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          Your payment is processing. If you don’t see a download button, check
          your email shortly.
        </p>
      )}

      <div className="mt-8">
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to products
        </Link>
      </div>
    </main>
  );
}
