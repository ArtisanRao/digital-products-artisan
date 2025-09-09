import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { productId, qty = 1 } = await req.json();

    const product = products.find((p) => p.id === Number(productId));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    // Make the image absolute for Stripe (recommended)
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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Checkout error" }, { status: 500 });
  }
}
