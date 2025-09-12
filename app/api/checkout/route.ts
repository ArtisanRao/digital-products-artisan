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

// Minimal EU set for Klarna eligibility
const EU = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
]);

function decideCurrency(request: Request, bodyCurrency?: string): "usd" | "eur" {
  // 1) honor explicit client choice, if provided
  const v = String(bodyCurrency || "").toLowerCase();
  if (v === "eur" || v === "usd") return v as "eur" | "usd";

  // 2) geo fallback (Vercel/Cloudflare headers)
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";

  if (EU.has(country.toUpperCase())) return "eur";

  // 3) default
  return "usd";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // Decide currency (client hint or EU geo)
    const currency = decideCurrency(req, (body as any).currency);

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
      return NextResponse.json({ error: "No valid products in request." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const stripe = getStripe();

    // Build Stripe line_items (inline price_data so amount comes from your catalog)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = chosen.map(
      ({ p, qty }) => {
        const firstImage = p.images?.[0] ?? p.image;
        const absoluteImage = firstImage?.startsWith("http")
          ? firstImage
          : `${baseUrl}${firstImage ?? ""}`;

        return {
          quantity: qty,
          price_data: {
            currency,                                 // USD by default; EUR in EU / if chosen
            unit_amount: Math.round(p.price * 100),   // same numeric amount in chosen currency
            product_data: {
              name: p.title,
              images: absoluteImage ? [absoluteImage] : [],
              metadata: { slug: p.slug, productId: String(p.id) },
            },
          },
        };
      }
    );

    // Explicitly list allowed methods (blocks Link by omission).
    // Apple Pay / Google Pay come through "card" automatically when eligible.
    const payment_method_types =
      currency === "eur"
        ? (["card", "paypal", "klarna"] as const)
        : (["card", "paypal"] as const);

    const params: any = {
      mode: "payment",
      line_items,
      payment_method_types,                   // <— keep explicit list (no Link)
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        chosen.length === 1
          ? `${baseUrl}/products/${chosen[0].p.id}`
          : `${baseUrl}/products`,
      billing_address_collection: "required", // helps eligibility (Klarna, wallets)
      locale: "auto",
      metadata: { currencyChosen: currency },
    };

    const session = await stripe.checkout.sessions.create(
      params as Stripe.Checkout.SessionCreateParams
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session (no URL)" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, currencyUsed: currency });
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
      seenCountry: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null,
      note: "Link is blocked by using explicit payment_method_types only.",
    });
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
