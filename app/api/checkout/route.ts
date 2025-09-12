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

type BodySingle = { productId: number | string; qty?: number; currency?: string };
type BodyCart   = { cart: Array<{ productId: number | string; qty?: number }>; currency?: string };
type Body       = BodySingle | BodyCart;

function toInt(n: any, fallback = 1) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}

// Minimal EU list for Klarna logic
const EU = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
]);

/** Decide currency from client body, else IP-country header, else default USD */
function decideCurrency(request: Request, bodyCurrency?: string): "usd" | "eur" {
  const v = String(bodyCurrency || "").toLowerCase();
  if (v === "eur") return "eur";
  if (v === "usd") return "usd";

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";

  if (EU.has(country.toUpperCase())) return "eur";
  return "usd";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // Currency chosen by client/localStorage or geo fallback
    const currency = decideCurrency(req, (body as any).currency);

    // Normalize to array
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

    // Validate & map
    const chosen = items
      .map(({ productId, qty }) => {
        const p = productsById[productId] || products.find((x) => x.id === productId);
        return p ? { p, qty } : null;
      })
      .filter(Boolean) as Array<{ p: (typeof products)[number]; qty: number }>;

    if (!chosen.length) {
      return NextResponse.json({ error: "No valid products in request." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const stripe = getStripe();

    // Build line items with chosen currency
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = chosen.map(({ p, qty }) => {
      const firstImage = p.images?.[0] ?? p.image;
      const absoluteImage = firstImage?.startsWith("http") ? firstImage : `${baseUrl}${firstImage || ""}`;
      return {
        quantity: qty,
        price_data: {
          currency,                            // 👈 USD or EUR
          unit_amount: Math.round(p.price * 100),
          product_data: {
            name: p.title,
            images: absoluteImage ? [absoluteImage] : [],
            metadata: { slug: p.slug, productId: String(p.id) },
          },
        },
      };
    });

    // Decide payment methods:
    // - "card" → Apple Pay & Google Pay appear automatically on Stripe Checkout
    // - "klarna" only with EUR (and when eligible)
    // - "paypal" if you set env STRIPE_ENABLE_PAYPAL=1 and have PayPal enabled in Stripe
    const pmTypes: string[] = ["card"];
    if (currency === "eur") pmTypes.push("klarna");
    if (process.env.STRIPE_ENABLE_PAYPAL === "1") pmTypes.push("paypal");

    // Create Checkout Session
    const params: any = {
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: chosen.length === 1 ? `${baseUrl}/products/${chosen[0].p.id}` : `${baseUrl}/products`,
      payment_method_types: pmTypes,
      billing_address_collection: "required", // helps Klarna eligibility
      locale: "auto",
      phone_number_collection: { enabled: true }, // optional but can help certain PMs
      metadata: { currencyChosen: currency },
    };

    const session = await stripe.checkout.sessions.create(
      params as Stripe.Checkout.SessionCreateParams
    );

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session (no URL)" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, currencyUsed: currency, pmTypes });
  } catch (err: any) {
    console.error("Checkout error:", {
      message: err?.message, name: err?.name, type: err?.type, stack: err?.stack,
    });

    const msg = err?.message?.includes("STRIPE_SECRET_KEY")
      ? "Server misconfigured (missing STRIPE_SECRET_KEY)"
      : "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("diag") === "1") {
    return NextResponse.json({
      runtime: (process as any).env?.NEXT_RUNTIME ?? "unknown",
      node: process.version,
      stripeEnvSet: !!process.env.STRIPE_SECRET_KEY,
      siteUrlSet: !!process.env.NEXT_PUBLIC_SITE_URL,
      enablePaypal: process.env.STRIPE_ENABLE_PAYPAL === "1",
      seenCountry: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null,
    });
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
