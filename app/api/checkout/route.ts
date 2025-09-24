// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

const SUPPORTED = new Set(["USD", "EUR"]);

// --- Stripe client (Node runtime) ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// --- Helpers ---
function findProductByKey(key: string | number) {
  const s = String(key);
  const asNum = Number(s);
  if (Number.isFinite(asNum)) {
    const byId = products.find((p) => Number(p.id) === asNum);
    if (byId) return byId;
  }
  const bySlug = products.find((p) => String(p.slug) === s);
  if (bySlug) return bySlug;
  const byIdStr = products.find((p) => String(p.id) === s);
  return byIdStr ?? null;
}

function siteBase(req: NextRequest) {
  // Prefer env; fallback to Origin header; else derive from request URL
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) return envBase.replace(/\/+$/, "");
  const hdr = req.headers.get("origin");
  if (hdr) return hdr.replace(/\/+$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function toMinorUnits(amount: number) {
  // USD/EUR → two decimals
  return Math.round(amount * 100);
}

function normalizeCurrency(c?: string) {
  const upper = String(c || "EUR").toUpperCase();
  return SUPPORTED.has(upper) ? upper : "EUR";
}

function lcCurrency(c: string) {
  return c.toLowerCase(); // "eur" | "usd"
}

function imageForProduct(origin: string, product: any) {
  const imageRel = Array.isArray(product.images) && product.images.length
    ? product.images[0]
    : product.image;
  if (!imageRel) return undefined;
  return imageRel.startsWith("http") ? imageRel : `${origin}${imageRel}`;
}

async function createSessionFromSingle(opts: {
  productKey: string; // id or slug
  qty?: number;
  currency?: string; // USD/EUR
  origin: string;
}) {
  const { productKey, qty = 1, currency = "EUR", origin } = opts;
  const product = findProductByKey(productKey);
  if (!product) throw new Error(`Unknown product ${productKey}`);

  const priceNumber = typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const priceId: string | undefined = (product as any).priceId;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
    ? [{ price: priceId, quantity: qty }]
    : [
        {
          quantity: qty,
          price_data: {
            currency: lcCurrency(currency),
            unit_amount: toMinorUnits(priceNumber),
            product_data: {
              name: product.title,
              description: product.description?.slice(0, 400),
              images: imageForProduct(origin, product) ? [imageForProduct(origin, product)!] : [],
            },
          },
        },
      ];

  const payment_method_types: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    currency === "EUR" ? ["card", "klarna"] : ["card"];

  const prodPath = product.slug ? `/products/${encodeURIComponent(String(product.slug))}`
                                : `/products/${encodeURIComponent(String(product.id))}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    billing_address_collection: "auto",
    submit_type: "pay",
    client_reference_id: String(product.id),
    metadata: {
      productId: String(product.id),
      slug: String(product.slug ?? ""),
      qty: String(qty),
      currency,
    },
    line_items,
    success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${prodPath}`,
  });

  return session.url!;
}

// --- GET → redirect to Stripe (works with <Link href="/api/checkout?...">) ---
export async function GET(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const slug = url.searchParams.get("slug");
    const qty = Math.max(1, Number(url.searchParams.get("qty") ?? 1));
    const currency = normalizeCurrency(url.searchParams.get("currency") ?? "EUR");
    const origin = siteBase(req);

    const productKey = productId ?? slug;
    if (!productKey) {
      return NextResponse.json({ error: "Missing productId or slug" }, { status: 400 });
    }

    const redirectUrl = await createSessionFromSingle({
      productKey,
      qty,
      currency,
      origin,
    });

    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (err: any) {
    console.error("Checkout GET error:", err);
    return NextResponse.json({ error: err?.message || "Checkout error" }, { status: 500 });
  }
}

// --- POST → return { url } (for client fetch-based buttons) ---
// Accepts either:
// 1) { productId | slug, qty?, currency? }  OR
// 2) { line_items: [{ price, quantity }...], mode? }  OR
// 3) { items: [{ slug, quantity }...], mode? }  (slug can be id or slug)
export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const origin = siteBase(req);
    const body = await req.json().catch(() => ({} as any));

    // Case 1: single product by id or slug
    if (body?.productId || body?.slug) {
      const qty = Math.max(1, Number(body?.qty ?? 1));
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const productKey = String(body.productId ?? body.slug);
      const url = await createSessionFromSingle({ productKey, qty, currency, origin });
      return NextResponse.json({ url });
    }

    // Case 2: explicit Stripe price ids
    if (Array.isArray(body?.line_items) && body.line_items.length) {
      const session = await stripe.checkout.sessions.create({
        mode: (body.mode as "payment" | undefined) ?? "payment",
        line_items: body.line_items,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        submit_type: "pay",
        success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Case 3: items by id/slug resolved from our products list
    if (Array.isArray(body?.items) && body.items.length) {
      const resolved: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      for (const it of body.items) {
        const product = findProductByKey(it.slug);
        if (!product) continue;

        const qty = Math.max(1, Number(it.quantity ?? 1));
        const priceId: string | undefined = (product as any).priceId;
        if (priceId) {
          resolved.push({ price: priceId, quantity: qty });
        } else {
          const priceNumber = typeof product.price === "number" ? product.price : Number(product.price) || 0;
          resolved.push({
            quantity: qty,
            price_data: {
              currency: "eur",
              unit_amount: toMinorUnits(priceNumber),
              product_data: { name: product.title },
            },
          });
        }
      }

      if (!resolved.length) {
        return NextResponse.json({ error: "No valid items" }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: (body.mode as "payment" | undefined) ?? "payment",
        line_items: resolved,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        submit_type: "pay",
        success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
      });
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (err: any) {
    console.error("Checkout POST error:", err);
    return NextResponse.json({ error: err?.message || "Checkout error" }, { status: 500 });
  }
}
