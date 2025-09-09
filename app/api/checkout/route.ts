// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

export const runtime = "nodejs";           // ✅ ensure Node runtime (Stripe SDK needs Node)
export const dynamic = "force-dynamic";    // optional, but avoids static optimization

// Lazily create Stripe so build doesn't crash if env isn't present at import time
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Throw only when the route is actually invoked, not at build/import time
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(key); // no apiVersion literal to avoid TS mismatch
  return _stripe;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const productId = Number(body.productId);
    const qty = Math.max(1, Number(body.qty) || 1);

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    // Absolute image for Stripe
    const firstImage = product.images?.[0] ?? product.image;
    const absoluteImage = firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}${firstImage}`;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.title,
              images: [absoluteImage],
            },
          },
        },
      ],
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products/${product.id}`,
      metadata: {
        productId: String(product.id),
        slug: product.slug,
      },
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    const msg =
      typeof err?.message === "string" && err.message.includes("STRIPE_SECRET_KEY")
        ? "Server misconfigured (missing STRIPE_SECRET_KEY)"
        : "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
