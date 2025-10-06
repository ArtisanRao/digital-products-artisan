import { NextResponse } from "next/server";
import Stripe from "stripe";
import products from "@/lib/products.json";

// Helper to find product from JSON
function findProduct(id: string) {
  return (products as Array<any>).find((p) => p.id === id);
}

// Optional helper to derive an env var name from a slug
function envNameForPriceId(productId: string) {
  return `STRIPE_PRICE_ID_${productId.replace(/-/g, "_").toUpperCase()}`;
}

export async function POST(req: Request) {
  // --- Validate env first (clear errors if misconfigured) ---
  const secret = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration: STRIPE_SECRET_KEY is not set" },
      { status: 500 }
    );
  }
  if (!siteUrl) {
    return NextResponse.json(
      { error: "Server misconfiguration: NEXT_PUBLIC_SITE_URL is not set" },
      { status: 500 }
    );
  }

  const { productId } = await req.json();
  const p = findProduct(productId);

  if (!p) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Price resolution order:
  // 1) products.json → p.stripePriceId
  // 2) env var STRIPE_PRICE_ID_<SLUG>
  // 3) final fallback (your pasted live price)
  const envKey = envNameForPriceId(productId);
  const fallbackLivePriceId = "price_1S4qZbLRZXb99FYz8MhczfRW"; // ← replace/remove when you set the env or JSON
  const priceId: string | undefined =
    p.stripePriceId ||
    process.env[envKey] ||
    (productId === "passive-income-ebook" ? fallbackLivePriceId : undefined);

  if (!priceId) {
    return NextResponse.json(
      {
        error:
          `Missing Stripe price id. Set p.stripePriceId in products.json or env ${envKey}.`,
      },
      { status: 400 }
    );
  }

  // Initialize Stripe (let SDK pick its apiVersion)
  const stripe = new Stripe(secret);

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    // If you've configured Stripe Tax in LIVE, this is fine; otherwise set to false
    automatic_tax: { enabled: true },

    // Collect email on Stripe Checkout if you aren't passing a customer
    customer_creation: "if_required",
    billing_address_collection: "auto",

    success_url: `${siteUrl}/success?pid=${productId}&sid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/product/${productId}`,

    // Metadata used by your webhook to build download links
    metadata: {
      productId,
      fileUrl: p.fileUrl ?? "", // keep your fileUrl available to your system
    },
  });

  return NextResponse.json({ url: session.url });
}
