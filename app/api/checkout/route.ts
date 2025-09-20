import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products"; // ← use your local catalog

const SUPPORTED = new Set(["USD", "EUR"]);

function findProduct(productId: number) {
  return products.find((p) => Number(p.id) === Number(productId)) || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const productId = Number(body?.productId);
    const qty = Math.max(1, Number(body?.qty ?? 1));
    const currencyRaw = String(body?.currency || "EUR").toUpperCase();
    const currency = SUPPORTED.has(currencyRaw) ? currencyRaw : "EUR";

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const product = findProduct(productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown product ${productId}` }, { status: 400 });
    }

    // Build absolute URLs
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const imageRel = (Array.isArray((product as any).images) ? (product as any).images[0] : product.image) || "";
    const imageAbs = imageRel?.startsWith("http") ? imageRel : `${origin}${imageRel || ""}`;

    // Stripe expects lowercase ISO currency ("eur", "usd")
    const currencyLc = currency.toLowerCase() as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Currency;
    const unit_amount = Math.round(Number(product.price) * 100); // €12.34 -> 1234

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const payment_method_types =
      currency === "EUR"
        ? (["card", "klarna"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[])
        : (["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[]);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types,
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: currencyLc,
            unit_amount,
            product_data: {
              name: product.title,
              images: imageAbs ? [imageAbs] : [],
              description: product.description?.slice(0, 400) || undefined,
            },
          },
        },
      ],
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      billing_address_collection: "auto",
      submit_type: "pay",
      client_reference_id: String(productId),
      metadata: { productId: String(productId), qty: String(qty), currency },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${productId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout route error:", err);
    return NextResponse.json({ error: err?.message || "Checkout error" }, { status: 500 });
  }
}

// Optional: reject accidental GETs (your logs showed 405s already)
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
