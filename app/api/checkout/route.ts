// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

export const runtime = "nodejs";         // make sure this runs on Node, not Edge
export const dynamic = "force-dynamic";  // avoid static optimization

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Explicit message returned to client and logged
    throw new Error("STRIPE_SECRET_KEY is not set in this environment");
  }
  // No apiVersion, use SDK default (avoids type mismatch at build)
  _stripe = new Stripe(key);
  return _stripe;
}

export async function POST(req: Request) {
  // Log a tiny bit of environment info (safe; no secrets)
  console.log("[/api/checkout] runtime=%s envOk=%s siteUrl=%s",
    (process as any).env?.NEXT_RUNTIME ?? "unknown",
    !!process.env.STRIPE_SECRET_KEY,
    process.env.NEXT_PUBLIC_SITE_URL ?? "n/a"
  );

  try {
    const body = await req.json().catch(() => ({} as any));
    const productId = Number(body.productId);
    const qty = Math.max(1, Number(body.qty) || 1);

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: `Product ${productId} not found` }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const firstImage = product.images?.[0] ?? product.image;
    const absoluteImage = firstImage.startsWith("http") ? firstImage : `${baseUrl}${firstImage}`;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(product.price * 100),
            product_data: { name: product.title, images: [absoluteImage] },
          },
        },
      ],
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products/${product.id}`,
      metadata: { productId: String(product.id), slug: product.slug },
    });

    if (!session.url) {
      console.error("[/api/checkout] No session.url returned");
      return NextResponse.json({ error: "Unable to create checkout session (no URL)" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // Stripe errors will usually have .type and .raw values
    console.error("[/api/checkout] error", {
      name: err?.name,
      message: err?.message,
      type: err?.type,
      raw: err?.raw,
      stack: err?.stack?.split("\n").slice(0, 3).join(" | "),
    });

    const msg = err?.message?.includes("STRIPE_SECRET_KEY")
      ? "Server misconfigured: STRIPE_SECRET_KEY is missing at runtime"
      : err?.message || "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
