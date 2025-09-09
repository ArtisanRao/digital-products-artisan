// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ✅ let SDK use its pinned apiVersion

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

    // Build absolute image URL for Stripe
    const firstImage = product.images?.[0] ?? product.image;
    const absoluteImage = firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}${firstImage}`;

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
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
