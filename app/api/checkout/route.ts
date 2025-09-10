// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products, productsById } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key);
  return _stripe;
}

type BodySingle = { productId: number | string; qty?: number };
type BodyCart = { cart: Array<{ productId: number | string; qty?: number }> };
type Body = BodySingle | BodyCart;

function toInt(n: any, fallback = 1) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // Normalize to an array of items
    const items: Array<{ productId: number; qty: number }> = Array.isArray(
      (body as BodyCart).cart
    )
      ? (body as BodyCart).cart.map((it) => ({
          productId: toInt(it.productId),
          qty: toInt(it.qty, 1),
        }))
      : [
          {
            productId: toInt((body as BodySingle).productId),
            qty: toInt((body as BodySingle).qty, 1),
          },
        ];

    // Validate & map to products
    const chosen = items
      .map(({ productId, qty }) => {
        const p = productsById[productId] || products.find((x) => x.id === productId);
        return p ? { p, qty } : null;
      })
      .filter(Boolean) as Array<{ p: (typeof products)[number]; qty: number }>;

    if (!chosen.length) {
      return NextResponse.json(
        { error: "No valid products in request." },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const stripe = getStripe();

    // Build Stripe line_items (inline price_data so amount comes from your catalog)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = chosen.map(
      ({ p, qty }) => {
        const firstImage = p.images?.[0] ?? p.image;
        const absoluteImage = firstImage.startsWith("http")
          ? firstImage
          : `${baseUrl}${firstImage}`;

        return {
          quantity: qty,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(p.price * 100),
            product_data: {
              name: p.title,
              images: [absoluteImage],
              // ⬇️ This metadata is what the confirmation page uses to
              // map back to your local product & create the download link
              metadata: {
                slug: p.slug,
                productId: String(p.id),
              },
            },
          },
        };
      }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        chosen.length === 1
          ? `${baseUrl}/products/${chosen[0].p.id}`
          : `${baseUrl}/products`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session (no URL)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
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

export async function GET(req: Request) {
  // Diagnostics when visiting /api/checkout?diag=1
  const url = new URL(req.url);
  if (url.searchParams.get("diag") === "1") {
    return NextResponse.json({
      runtime: (process as any).env?.NEXT_RUNTIME ?? "unknown",
      node: process.version,
      stripeEnvSet: !!process.env.STRIPE_SECRET_KEY,
      siteUrlSet: !!process.env.NEXT_PUBLIC_SITE_URL,
    });
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
