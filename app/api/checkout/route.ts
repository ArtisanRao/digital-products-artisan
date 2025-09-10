// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // no apiVersion => uses the SDK’s default that matches the installed package
  _stripe = new Stripe(key);
  return _stripe;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const productId = Number(body?.productId);
    const qty = Math.max(1, Number(body?.qty) || 1);

    console.log("checkout: incoming", { productId, qty });

    const product = products.find((p) => p.id === productId);
    if (!product) {
      console.error("checkout: product not found", { productId });
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

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
    });

    if (!session.url) {
      console.error("checkout: Stripe returned no session.url");
      return NextResponse.json(
        { error: "Unable to create checkout session (no URL)" },
        { status: 500 }
      );
    }

    console.log("checkout: created session", { id: session.id, url: session.url });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", {
      message: err?.message,
      name: err?.name,
      type: err?.type,
      stack: err?.stack,
    });

    const msg =
      typeof err?.message === "string" && err.message.includes("STRIPE_SECRET_KEY")
        ? "Server misconfigured (missing STRIPE_SECRET_KEY)"
        : "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
