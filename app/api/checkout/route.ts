// app/api/checkout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";

const SUPPORTED = new Set(["USD", "EUR"]);

/* ------------------------ Utilities ------------------------ */
function normalizeCurrency(c?: string) {
  const upper = String(c || "EUR").toUpperCase();
  return SUPPORTED.has(upper) ? upper : "EUR";
}
function lcCurrency(c: string) {
  return c.toLowerCase(); // "eur" | "usd"
}
function toMinorUnits(amount: number) {
  return Math.round(amount * 100); // cents
}
function siteBase(req: NextRequest) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) return envBase.replace(/\/+$/, "");
  const hdr = req.headers.get("origin");
  if (hdr) return hdr.replace(/\/+$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
function findProductByKey(key: string | number | null | undefined) {
  if (key === null || key === undefined) return null;
  const s = String(key);
  const asNum = Number(s);
  if (Number.isFinite(asNum)) {
    const byId = products.find((p: any) => Number(p.id) === asNum);
    if (byId) return byId;
  }
  return (
    products.find((p: any) => String(p.slug) === s) ||
    products.find((p: any) => String(p.id) === s) ||
    null
  );
}
function imageForProduct(origin: string, product: any) {
  const rel =
    Array.isArray(product.images) && product.images.length
      ? product.images[0]
      : product.image;
  if (!rel) return undefined;
  return String(rel).startsWith("http") ? String(rel) : `${origin}${rel}`;
}
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(key);
}

/** Build desired payment methods. Adds PayPal for all, Klarna for EUR.
 * NOTE: Some @types/stripe versions don't include "paypal" yet.
 * Casting to any keeps TS happy while Stripe accepts it at runtime. */
function paymentMethodsForCurrency(c?: string) {
  const cur = normalizeCurrency(c);
  return (cur === "EUR" ? ["card", "klarna", "paypal"] : ["card", "paypal"]) as any;
}

/* ------------------------ Bundle catalog ------------------------ */
/** Keep in sync with app/bundles/page.tsx slugs, prices & images. */
const BUNDLES: Record<string, { name: string; price: number; image: string }> = {
  "complete-creator-bundle": {
    name: "Complete Creator Bundle",
    price: 79.99,
    image: "/images/bundles/complete-creator-bundle-cover.jpg",
  },
  "social-media-master-pack": {
    name: "Social Media Master Pack",
    price: 49.99,
    image: "/images/bundles/social-media-master-pack-cover.jpg",
  },
  "business-starter-bundle": {
    name: "Business Starter Bundle",
    price: 59.99,
    image: "/images/bundles/business-starter-bundle-cover.jpg",
  },
  "ai-productivity-suite": {
    name: "AI Productivity Suite",
    price: 39.99,
    image: "/images/bundles/ai-productivity-suite-cover.jpg",
  },
};

/* -------------------- Core session builders -------------------- */
async function createSessionFromSingle(opts: {
  productKey: string | number; // id or slug
  qty?: number;
  currency?: string; // USD/EUR
  origin: string;
}) {
  const stripe = getStripe();
  const { productKey, qty = 1, currency = "EUR", origin } = opts;

  const product = findProductByKey(productKey);
  if (!product) throw new Error(`Unknown product ${productKey}`);

  const priceNumber =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
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
              images: (() => {
                const img = imageForProduct(origin, product);
                return img ? [img] : [];
              })(),
            },
          },
        },
      ];

  const payment_method_types = paymentMethodsForCurrency(currency);

  const prodPath = product.slug
    ? `/products/${encodeURIComponent(String(product.slug))}`
    : `/products/${encodeURIComponent(String(product.id))}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types,
    line_items,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    billing_address_collection: "auto",
    submit_type: "pay",
    client_reference_id: String(product.id),
    metadata: {
      kind: "product",
      productId: String(product.id),
      slug: String(product.slug ?? ""),
      qty: String(qty),
      currency: normalizeCurrency(currency),
    },
    success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${prodPath}`,
  });

  if (!session.url) throw new Error("Stripe session did not return a URL");
  return session.url;
}

async function createSessionFromBundle(opts: {
  handle: string; // bundle slug (e.g. "complete-creator-bundle")
  qty?: number;
  currency?: string;
  origin: string;
}) {
  const stripe = getStripe();
  const { handle, qty = 1, currency = "EUR", origin } = opts;

  const b = BUNDLES[handle];
  if (!b) throw new Error(`Unknown bundle: ${handle}`);

  const payment_method_types = paymentMethodsForCurrency(currency);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types,
    line_items: [
      {
        quantity: qty,
        price_data: {
          currency: lcCurrency(currency),
          unit_amount: toMinorUnits(b.price),
          product_data: {
            name: b.name,
            images: [b.image.startsWith("http") ? b.image : `${origin}${b.image}`],
          },
        },
      },
    ],
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    billing_address_collection: "auto",
    submit_type: "pay",
    client_reference_id: `bundle:${handle}`,
    metadata: {
      kind: "bundle",
      bundle: handle,
      qty: String(qty),
      currency: normalizeCurrency(currency),
    },
    success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/bundles/${handle}`,
  });

  if (!session.url) throw new Error("Stripe session did not return a URL");
  return session.url;
}

/* --------------------------- GET --------------------------- */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bundleId = url.searchParams.get("bundleId"); // ✅ bundle support
    let slug = url.searchParams.get("slug"); // may be "bundle:<slug>"
    const productId = url.searchParams.get("productId");
    const qty = Math.max(1, Number(url.searchParams.get("qty") ?? 1));
    const currency = normalizeCurrency(url.searchParams.get("currency") ?? "EUR");
    const origin = siteBase(req);

    // Normalize bundleId → slug=bundle:<id>
    if (!slug && bundleId) slug = `bundle:${bundleId}`;

    // Bundle branch
    if (slug && slug.startsWith("bundle:")) {
      const handle = slug.replace(/^bundle:/, "");
      const redirectUrl = await createSessionFromBundle({ handle, qty, currency, origin });
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    // Product branch (existing)
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
    const msg = err?.message || "Checkout error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/* --------------------------- POST --------------------------- */
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const origin = siteBase(req);
    const body = await req.json().catch(() => ({} as any));

    // Case 0: bundle by id or slug=bundle:<handle>
    if (body?.bundleId || (typeof body?.slug === "string" && body.slug.startsWith("bundle:"))) {
      const handle = body.bundleId ?? String(body.slug).replace(/^bundle:/, "");
      const qty = Math.max(1, Number(body?.qty ?? 1));
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const url = await createSessionFromBundle({ handle, qty, currency, origin });
      return NextResponse.json({ url });
    }

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
        payment_method_types: paymentMethodsForCurrency(body?.currency),
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
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const resolved: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      for (const it of body.items) {
        const key = it?.id ?? it?.slug ?? it?.productId;
        const product = findProductByKey(key);
        if (!product) continue;

        const qty = Math.max(1, Number(it?.qty ?? it?.quantity ?? 1));
        const priceId: string | undefined = (product as any).priceId;

        if (priceId) {
          resolved.push({ price: priceId, quantity: qty });
        } else {
          const priceNumber =
            typeof product.price === "number" ? product.price : Number(product.price) || 0;
          resolved.push({
            quantity: qty,
            price_data: {
              currency: lcCurrency(currency),
              unit_amount: toMinorUnits(priceNumber),
              product_data: {
                name: product.title,
                description: product.description?.slice(0, 400),
                images: (() => {
                  const img = imageForProduct(origin, product);
                  return img ? [img] : [];
                })(),
              },
            },
          });
        }
      }

      if (!resolved.length) {
        return NextResponse.json({ error: "No valid items" }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: (body.mode as "payment" | undefined) ?? "payment",
        payment_method_types: paymentMethodsForCurrency(currency),
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
