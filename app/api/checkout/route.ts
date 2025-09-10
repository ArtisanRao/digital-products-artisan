// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

export const runtime = "nodejs";         // Ensure Node runtime on Vercel
export const dynamic = "force-dynamic";  // Keep route server-side / dynamic

// Lazily init Stripe so missing envs don't crash build
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key); // no apiVersion param => matches installed SDK types
  return _stripe;
}

export async function POST(req: Request) {
  try {
    const { productId, qty = 1 } = await req.json();

    const product = products.find((p) => p.id === Number(productId));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    // Ensure absolute image URL for Stripe
    const firstImage = product.images?.[0] ?? product.image;
    const absoluteImage = firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}${firstImage}`;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: Math.max(1, Number(qty) || 1),
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
      return NextResponse.json(
        { error: "Unable to create checkout session (no URL)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // Visible in Vercel → Logs
    console.error("Checkout error:", {
      message: err?.message,
      name: err?.name,
      type: err?.type,
      stack: err?.stack,
    });

    const msg = err?.message?.includes("STRIPE_SECRET_KEY")
      ? "Server misconfigured (missing STRIPE_SECRET_KEY)"
      : "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Helpful 405 for accidental GETs
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
