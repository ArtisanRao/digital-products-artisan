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

// ───────────────────────────────────────────────────────────────────────────────
// Accepted body shapes
type BodySingle = { productId: number | string; qty?: number; currency?: string };
type BodyCart = { cart: Array<{ productId: number | string; qty?: number }>; currency?: string };
type BodyLines = {
  lines: Array<{
    id: number | string;
    name?: string;
    price?: number;     // client-supplied fallback; ignored if we find a catalog match
    image?: string;
    quantity?: number;
  }>;
  currency?: string;
};
type Body = BodySingle | BodyCart | BodyLines;
// ───────────────────────────────────────────────────────────────────────────────

function toInt(n: any, fallback = 1) {
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : fallback;
}
function toMoney(n: any) {
  const v = Number(n);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}
function isNumericLike(v: any) {
  return typeof v === "number" || (typeof v === "string" && /^[0-9]+$/.test(v));
}
function findCatalog(idOrSlug: number | string) {
  if (isNumericLike(idOrSlug)) {
    const id = Number(idOrSlug);
    return productsById[id] || products.find((p) => p.id === id) || null;
  }
  const slug = String(idOrSlug).toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slug) ||
    products.find((p) => String(p.id) === slug) || // super fallback
    null
  );
}

// Minimal EU set for Klarna eligibility
const EU = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
]);

function decideCurrency(request: Request, bodyCurrency?: string): "usd" | "eur" {
  const v = String(bodyCurrency || "").toLowerCase();
  if (v === "eur" || v === "usd") return v as "eur" | "usd";

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

    // Decide currency (client hint or EU geo)
    const currency = decideCurrency(req, (body as any).currency);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const stripe = getStripe();

    // ───────────────────────────────────────────────────────────────────────────
    // Build Stripe line_items from one of the accepted body shapes
    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let singleKnownProductUrl: string | null = null;

    if ("lines" in (body as any) && Array.isArray((body as BodyLines).lines)) {
      // New shape: "lines" from client
      const fromLines = (body as BodyLines).lines
        .map((ln) => {
          const qty = toInt(ln.quantity, 1);
          if (qty <= 0) return null;

          // Try to map to your catalog first (authoritative price & name)
          const cat = findCatalog(ln.id);
          const useName = cat?.title ?? ln.name ?? `Item ${String(ln.id ?? "")}`;
          const unitAmount =
            cat ? Math.round(cat.price * 100) : Math.round(toMoney(ln.price) * 100);

          if (!useName || unitAmount <= 0) return null;

          const img = (cat?.images?.[0] ?? cat?.image ?? ln.image) || "";
          const absoluteImage = img ? (img.startsWith("http") ? img : `${baseUrl}${img}`) : undefined;

          // If it's a single-known product, remember its page for cancel_url
          if ((body as BodyLines).lines.length === 1 && cat) {
            singleKnownProductUrl = `${baseUrl}/products/${cat.id}`;
          }

          return {
            quantity: qty,
            price_data: {
              currency,
              unit_amount: unitAmount,
              product_data: {
                name: useName,
                images: absoluteImage ? [absoluteImage] : [],
                metadata: {
                  from: "client-lines",
                  id: String(ln.id ?? ""),
                  ...(cat ? { slug: String(cat.slug), productId: String(cat.id) } : {}),
                },
              },
            },
          } as Stripe.Checkout.SessionCreateParams.LineItem;
        })
        .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];

      line_items = fromLines;
    } else {
      // Legacy shapes: single or cart -> resolve entirely from catalog
      const items: Array<{ productId: number | string; qty: number }> = Array.isArray(
        (body as BodyCart).cart
      )
        ? (body as BodyCart).cart.map((it) => ({
            productId: isNumericLike(it.productId) ? Number(it.productId) : String(it.productId),
            qty: toInt(it.qty, 1),
          }))
        : [
            {
              productId: isNumericLike((body as BodySingle).productId)
                ? Number((body as BodySingle).productId)
                : String((body as BodySingle).productId),
              qty: toInt((body as BodySingle).qty, 1),
            },
          ];

      const chosen = items
        .map(({ productId, qty }) => {
          const p = findCatalog(productId);
          return p ? { p, qty } : null;
        })
        .filter(Boolean) as Array<{ p: (typeof products)[number]; qty: number }>;

      if (!chosen.length) {
        return NextResponse.json({ error: "No valid products in request." }, { status: 400 });
      }

      if (chosen.length === 1) {
        singleKnownProductUrl = `${baseUrl}/products/${chosen[0].p.id}`;
      }

      line_items = chosen.map(({ p, qty }) => {
        const firstImage = p.images?.[0] ?? p.image;
        const absoluteImage = firstImage?.startsWith("http")
          ? firstImage
          : `${baseUrl}${firstImage ?? ""}`;

        return {
          quantity: qty,
          price_data: {
            currency,                               // USD by default; EUR in EU / if chosen
            unit_amount: Math.round(p.price * 100), // same numeric amount in chosen currency
            product_data: {
              name: p.title,
              images: absoluteImage ? [absoluteImage] : [],
              metadata: { slug: String(p.slug), productId: String(p.id) },
            },
          },
        };
      });
    }

    if (!line_items.length) {
      return NextResponse.json({ error: "No purchasable line items." }, { status: 400 });
    }

    // Explicitly list allowed methods (blocks Link by omission).
    // Apple Pay / Google Pay come through "card" automatically when eligible.
    const payment_method_types =
      currency === "eur"
        ? (["card", "paypal", "klarna"] as const)
        : (["card", "paypal"] as const);

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      payment_method_types: payment_method_types as unknown as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: singleKnownProductUrl ?? `${baseUrl}/cart`,
      billing_address_collection: "required",
      locale: "auto",
      metadata: { currencyChosen: currency },
    };

    const session = await stripe.checkout.sessions.create(params);

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
      note: "Link is blocked by using explicit payment_method_types only. Apple/Google Pay come through 'card'.",
    });
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
