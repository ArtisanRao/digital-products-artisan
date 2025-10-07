// app/api/checkout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products, productPath } from "@/data/products";
import { bundlesBySlug } from "@/app/bundles/data"; // single source for bundle prices/images

const SUPPORTED = new Set(["USD", "EUR"]);
type AllowedMethod = "card" | "paypal" | "klarna";

const VERCEL_ENV = process.env.VERCEL_ENV || "";
const IS_PROD_DEPLOY = VERCEL_ENV === "production";

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
  const envBase = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (envBase) return envBase.replace(/\/+$/, "");

  // Vercel provides VERCEL_URL (no protocol) on server
  const vercelUrl = (process.env.VERCEL_URL || "").trim();
  if (vercelUrl) {
    const proto = IS_PROD_DEPLOY ? "https" : "http";
    return `${proto}://${vercelUrl.replace(/\/+$/, "")}`;
  }

  // Fallback to request origin/host
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

/** Strict key validation + helpful errors (prevents accidental test/webhook/publishable keys) */
function getStripe(): Stripe {
  const raw = process.env.STRIPE_SECRET_KEY ?? "";
  const key = raw.trim();

  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Set a LIVE secret key (sk_live_...) in Vercel → Project → Settings → Environment Variables."
    );
  }
  if (key.startsWith("pk_")) {
    throw new Error("STRIPE_SECRET_KEY is a PUBLISHABLE key (pk_*). Use your LIVE SECRET key (sk_live_*).");
  }
  if (key.startsWith("whsec_")) {
    throw new Error("STRIPE_SECRET_KEY is a WEBHOOK secret (whsec_*). Use your LIVE SECRET key (sk_live_*).");
  }
  if (IS_PROD_DEPLOY && key.startsWith("sk_test_")) {
    throw new Error(
      "STRIPE_SECRET_KEY is a TEST key on a production deploy. Use a LIVE key (sk_live_*)."
    );
  }
  if (!/^sk_(live|test)_/i.test(key) && !/^rk_(live|test)_/i.test(key)) {
    // Unrecognized prefix (or restricted key not starting with rk_)
    console.warn("[stripe] STRIPE_SECRET_KEY has an unexpected prefix. Proceeding but this may fail.");
  }
  if (key.startsWith("rk_live_")) {
    // Allowed, but permissions must include checkout.sessions:write
    console.warn(
      "[stripe] Using a restricted live key (rk_live_*). Ensure it has 'checkout.sessions:write', 'prices:read', 'products:read'."
    );
  }

  // Use SDK's bundled apiVersion; safer across SDK bumps
  return new Stripe(key);
}

/** Build allowed methods per currency; if `only` is provided and valid, restrict to that single method */
function paymentMethodsForCurrency(
  c?: string,
  only?: AllowedMethod | null
): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  const cur = normalizeCurrency(c);
  const base: AllowedMethod[] = cur === "EUR" ? ["card", "klarna", "paypal"] : ["card", "paypal"];
  if (only && base.includes(only)) return [only];
  return base;
}

function logSession(kind: "product" | "bundle", s: Stripe.Checkout.Session) {
  try {
    console.log(
      `[checkout:${kind}] id=${s.id} livemode=${s.livemode} currency=${s.currency} methods=${(s.payment_method_types || []).join(",")}`
    );
    if (IS_PROD_DEPLOY && s.livemode === false) {
      console.warn(
        "[checkout] WARNING: Stripe session is TEST in a production deploy. Check Vercel env vars (live keys) and any PayPal/Klarna live configuration."
      );
    }
  } catch {}
}

/* -------------------- Core session builders -------------------- */
async function createSessionFromSingle(opts: {
  productKey: string | number;
  qty?: number;
  currency?: string;
  origin: string;
  onlyMethod?: AllowedMethod | null;
}) {
  const stripe = getStripe();
  const { productKey, qty = 1, currency = "EUR", origin, onlyMethod } = opts;

  const product = findProductByKey(productKey);
  if (!product) throw new Error(`Unknown product ${productKey}`);

  const priceNumber =
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const priceId: string | undefined =
    (product as any).priceId || (product as any).stripePriceId;

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

  const cancelPath = productPath(product);
  const success = `${origin}/downloads?order={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}&name={CUSTOMER_NAME}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodsForCurrency(currency, onlyMethod),
    line_items,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true }, // turn off if Stripe Tax not enabled live
    billing_address_collection: "auto",
    submit_type: "pay",
    client_reference_id: String(product.id),
    customer_creation: "if_required",
    metadata: {
      kind: "product",
      productId: String(product.id),
      slug: String(product.slug ?? ""),
      qty: String(qty),
      currency,
    },
    success_url: success,
    cancel_url: `${origin}${cancelPath}`,
  });

  logSession("product", session);

  if (!session.url) throw new Error("Stripe session did not return a URL");
  return session.url;
}

async function createSessionFromBundle(opts: {
  handle: string;
  qty?: number;
  currency?: string;
  origin: string;
  onlyMethod?: AllowedMethod | null;
}) {
  const stripe = getStripe();
  const { handle, qty = 1, currency = "EUR", origin, onlyMethod } = opts;

  const b = bundlesBySlug[handle];
  if (!b) throw new Error(`Unknown bundle: ${handle}`);

  const success = `${origin}/downloads?order={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}&name={CUSTOMER_NAME}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodsForCurrency(currency, onlyMethod),
    line_items: [
      {
        quantity: qty,
        price_data: {
          currency: lcCurrency(currency),
          unit_amount: toMinorUnits(b.price),
          product_data: {
            name: b.title,
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
      currency,
    },
    success_url: success,
    cancel_url: `${origin}/bundles/${handle}`,
  });

  logSession("bundle", session);

  if (!session.url) throw new Error("Stripe session did not return a URL");
  return session.url;
}

/* --------------------------- GET --------------------------- */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const bundleId = url.searchParams.get("bundleId");
    let slug = url.searchParams.get("slug"); // may be "bundle:<slug>"
    const productId = url.searchParams.get("productId");
    const qty = Math.max(1, Number(url.searchParams.get("qty") ?? 1));
    const currency = normalizeCurrency(url.searchParams.get("currency") ?? "EUR");
    const onlyParam = url.searchParams.get("only")?.toLowerCase() as
      | AllowedMethod
      | undefined;
    const onlyMethod: AllowedMethod | null =
      onlyParam && ["card", "paypal", "klarna"].includes(onlyParam) ? onlyParam : null;

    const origin = siteBase(req);

    if (!slug && bundleId) slug = `bundle:${bundleId}`;

    if (slug && slug.startsWith("bundle:")) {
      const handle = slug.replace(/^bundle:/, "");
      const redirectUrl = await createSessionFromBundle({
        handle,
        qty,
        currency,
        origin,
        onlyMethod,
      });
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const productKey = productId ?? slug;
    if (!productKey) {
      return NextResponse.json({ error: "Missing productId or slug" }, { status: 400 });
    }

    const redirectUrl = await createSessionFromSingle({
      productKey,
      qty,
      currency,
      origin,
      onlyMethod,
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

    const methodParam = (body?.method || body?.only)?.toString()?.toLowerCase() as
      | AllowedMethod
      | undefined;
    const onlyMethod: AllowedMethod | null =
      methodParam && ["card", "paypal", "klarna"].includes(methodParam)
        ? methodParam
        : null;

    // Bundle
    if (body?.bundleId || (typeof body?.slug === "string" && body.slug.startsWith("bundle:"))) {
      const handle = body.bundleId ?? String(body.slug).replace(/^bundle:/, "");
      const qty = Math.max(1, Number(body?.qty ?? 1));
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const url = await createSessionFromBundle({
        handle,
        qty,
        currency,
        origin,
        onlyMethod,
      });
      return NextResponse.json({ url });
    }

    // Single product
    if (body?.productId || body?.slug) {
      const qty = Math.max(1, Number(body?.qty ?? 1));
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const productKey = String(body.productId ?? body.slug);
      const url = await createSessionFromSingle({
        productKey,
        qty,
        currency,
        origin,
        onlyMethod,
      });
      return NextResponse.json({ url });
    }

    // Raw price IDs passthrough
    if (Array.isArray(body?.line_items) && body.line_items.length) {
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const session = await stripe.checkout.sessions.create({
        mode: (body.mode as "payment" | undefined) ?? "payment",
        payment_method_types: paymentMethodsForCurrency(currency, onlyMethod),
        line_items: body.line_items,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        submit_type: "pay",
        success_url: `${origin}/downloads?order={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}&name={CUSTOMER_NAME}`,
        cancel_url: `${origin}/cart`,
      });
      logSession("product", session);
      return NextResponse.json({ url: session.url });
    }

    // Items resolved from our catalogs
    if (Array.isArray(body?.items) && body.items.length) {
      const currency = normalizeCurrency(body?.currency ?? "EUR");
      const resolved: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      for (const it of body.items) {
        // Support: { id } | { slug } | { productId } | { bundleId }
        if (it?.bundleId || (typeof it?.slug === "string" && it.slug.startsWith("bundle:"))) {
          const handle = it.bundleId ?? String(it.slug).replace(/^bundle:/, "");
          const b = bundlesBySlug[handle];
          if (!b) continue;
          const qty = Math.max(1, Number(it?.qty ?? it?.quantity ?? 1));
          resolved.push({
            quantity: qty,
            price_data: {
              currency: lcCurrency(currency),
              unit_amount: toMinorUnits(b.price),
              product_data: {
                name: b.title,
                images: [b.image.startsWith("http") ? b.image : `${origin}${b.image}`],
              },
            },
          });
          continue;
        }

        const key = it?.id ?? it?.slug ?? it?.productId;
        const product = findProductByKey(key);
        if (!product) continue;

        const qty = Math.max(1, Number(it?.qty ?? it?.quantity ?? 1));
        const priceId: string | undefined =
          (product as any).priceId || (product as any).stripePriceId;

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
        payment_method_types: paymentMethodsForCurrency(currency, onlyMethod),
        line_items: resolved,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        billing_address_collection: "auto",
        submit_type: "pay",
        success_url: `${origin}/downloads?order={CHECKOUT_SESSION_ID}&email={CUSTOMER_EMAIL}&name={CUSTOMER_NAME}`,
        cancel_url: `${origin}/cart`,
      });
      logSession("product", session);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (err: any) {
    console.error("Checkout POST error:", err);
    return NextResponse.json({ error: err?.message || "Checkout error" }, { status: 500 });
  }
}
