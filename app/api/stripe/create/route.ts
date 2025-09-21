import { NextResponse } from "next/server";
import Stripe from "stripe";
import products from "@/lib/products.json";

// Helper to find product from JSON
function findProduct(id: string) {
  return products.find((p) => p.id === id);
}

export async function POST(req: Request) {
  const { productId } = await req.json();
  const p = findProduct(productId);

  if (!p) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Use your real Price ID from Stripe for Passive Income Ebook
  let priceId: string | null = null;

  if (productId === "passive-income-ebook") {
    priceId = "price_1S4qZbLRZXb99FYz8MhczfRW"; // ðŸ‘ˆ Replace with your actual price ID
  }

  if (!priceId) {
    return NextResponse.json({ error: "Price ID missing" }, { status: 400 });
  }

  // âœ… Initialize Stripe here to avoid build-time crash on Vercel
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    automatic_tax: { enabled: true },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?pid=${productId}&sid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${productId}`,
    metadata: {
      productId,
      blobKey: p.fileUrl, // âœ… Using fileUrl instead of blobKey
    },
  });

  return NextResponse.json({ url: session.url });
}
