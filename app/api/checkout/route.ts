import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/** Map productId -> Stripe Price IDs by currency */
const PRICE_BY_PRODUCT: Record<number, { USD?: string; EUR?: string }> = {
  // TODO: fill these with your real prices
  1: { EUR: "price_1S4qZbLRZXb99FYz8MhczfRW" },
};

const SUPPORTED = new Set(["USD", "EUR"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const productId = Number(body?.productId);
    const qty = Math.max(1, Number(body?.qty ?? 1));
    const currency = String(body?.currency || "USD").toUpperCase();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }
    if (!SUPPORTED.has(currency)) {
      return NextResponse.json({ error: `Unsupported currency: ${currency}` }, { status: 400 });
    }

    // Let the SDK use its own pinned apiVersion to avoid TS mismatch
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const priceId =
      (currency === "EUR" ? PRICE_BY_PRODUCT[productId]?.EUR : PRICE_BY_PRODUCT[productId]?.USD) ||
      PRICE_BY_PRODUCT[productId]?.USD || PRICE_BY_PRODUCT[productId]?.EUR;

    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for product ${productId} (${currency})` },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const cancelPath = `/products/${productId}`;
    const successPath = `/thank-you`;

    // ✅ Use explicit payment_method_types to satisfy older typings
    const payment_method_types =
      currency === "EUR" ? (["card", "klarna"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[])
                         : (["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[]);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types,
      line_items: [{ price: priceId, quantity: qty }],
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      success_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout route error:", err);
    return NextResponse.json({ error: err?.message || "Checkout error" }, { status: 500 });
  }
}
