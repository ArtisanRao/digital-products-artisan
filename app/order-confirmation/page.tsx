// app/order-confirmation/page.tsx
import Stripe from "stripe";

export const runtime = "nodejs"; // ensure Node runtime (stripe SDK works here)

type Search = { session_id?: string };

let _stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (_stripe) return _stripe;
  _stripe = new Stripe(key); // no apiVersion => uses SDK's default
  return _stripe;
}

async function getSession(session_id: string) {
  const stripe = getStripe();
  if (!stripe) return null;
  try {
    return await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });
  } catch (err: any) {
    console.error("order-confirmation: retrieve session failed", {
      message: err?.message,
      type: err?.type,
      stack: err?.stack,
    });
    return null;
  }
}

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { session_id } = await searchParams;
  const session = session_id ? await getSession(session_id) : null;

  const amount =
    typeof session?.amount_total === "number"
      ? (session.amount_total / 100).toFixed(2)
      : null;
  const email = session?.customer_details?.email ?? null;

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Thank you!</h1>

      {session ? (
        <p className="mt-2">
          We received your order{amount ? ` of $${amount}` : ""}.
          {email ? ` A receipt was sent to ${email}.` : ""}
        </p>
      ) : (
        <p className="mt-2">
          We couldn’t load your checkout details. If you completed payment,
          you’ll receive a receipt by email shortly. Otherwise please{" "}
          <a className="underline" href="/support">
            contact support
          </a>
          .
        </p>
      )}

      <a className="mt-6 inline-block underline" href="/products">
        Back to products
      </a>
    </main>
  );
}
