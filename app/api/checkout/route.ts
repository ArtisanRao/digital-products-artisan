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

// Countries used to default to EUR (helps Klarna)
const EU = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
]);

function pickCurrency(req: Request, bodyCurrency?: string): "usd" | "eur" {
  const v = String(bodyCurrency || "").toLowerCase();
  if (v === "eur" || v === "usd") return v as "usd" | "eur";
  const country = (req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "").toUpperCase();
  return EU.has(country) ? "eur" : "usd";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const currency = pickCurrency(req, (body as any).currency);

    // Normalize to items
    const items: Array<{ productId: number; qty: number }> = Array.isArray((body as BodyCart).cart)
      ? (body as BodyCart).cart.map((it) => ({ productId: toInt(it.productId), qty: toInt(it.qty, 1) }))
      : [{ productId: toInt((body as BodySingle).productId), qty: toInt((body as BodySingle).qty, 1) }];

    // Validate & map to product data
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

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = chosen.map(({ p, qty }) => {
      const firstImage = p.images?.[0] ?? p.image;
      const absoluteImage = firstImage?.startsWith("http") ? firstImage : (firstImage ? `${baseUrl}${firstImage}` : undefined);
      return {
        quantity: qty,
        price_data: {
          currency,
          unit_amount: Math.round(p.price * 100),
          product_data: {
            name: p.title,
            images: absoluteImage ? [absoluteImage] : [],
            metadata: { slug: p.slug, productId: String(p.id) },
          },
        },
      };
    });

    // Explicitly disable automatic PMs so Link can't appear
    // and specify only the methods we want.
    const payment_method_types =
      currency === "eur" ? (["card", "paypal", "klarna"] as const) : (["card", "paypal"] as const);

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      automatic_payment_methods: { enabled: false }, // <-- blocks Link auto-inclusion
      payment_method_types: payment_method_types as any,
      billing_address_collection: "required",
      locale: "auto",
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: chosen.length === 1 ? `${baseUrl}/products/${chosen[0].p.id}` : `${baseUrl}/products`,
      metadata: { currencyChosen: currency },
    };

    const session = await stripe.checkout.sessions.create(params as any);

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session (no URL)" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, currencyUsed: currency });
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
      seenCountry: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null,
    });
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
