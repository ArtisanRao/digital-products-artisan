// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { productsBySlug, productsById } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartItemIn = { slug?: string; id?: number; qty?: number };
type Body =
  | { items: CartItemIn[] }
  | { slug: string; qty?: number }
  | { id: number; qty?: number };

function baseUrlForPayPal() {
  const env = (process.env.PAYPAL_ENV || "sandbox").toLowerCase();
  return env === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const cid = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!cid || !secret) throw new Error("Missing PAYPAL_CLIENT_ID/SECRET");

  const res = await fetch(`${baseUrlForPayPal()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${cid}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${txt}`);
  }
  const json = await res.json();
  return json.access_token as string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // Normalize to an array of local products with qty
    const wanted: { slug: string; title: string; price: number; qty: number }[] =
      [];

    if ("items" in body && Array.isArray(body.items)) {
      for (const it of body.items) {
        const local =
          (it.slug && productsBySlug[it.slug]) ||
          (typeof it.id === "number" && productsById[it.id]);
        if (!local) continue;
        wanted.push({
          slug: local.slug,
          title: local.title,
          price: local.price,
          qty: Math.max(1, Number(it.qty) || 1),
        });
      }
    } else if ("slug" in body && body.slug) {
      const local = productsBySlug[body.slug];
      if (!local) throw new Error("Unknown product slug");
      wanted.push({
        slug: local.slug,
        title: local.title,
        price: local.price,
        qty: Math.max(1, Number(body.qty) || 1),
      });
    } else if ("id" in body && typeof body.id === "number") {
      const local = productsById[body.id];
      if (!local) throw new Error("Unknown product id");
      wanted.push({
        slug: local.slug,
        title: local.title,
        price: local.price,
        qty: Math.max(1, Number(body.qty) || 1),
      });
    } else {
      throw new Error("Invalid request body");
    }

    if (!wanted.length) {
      return NextResponse.json(
        { error: "No valid items in cart" },
        { status: 400 }
      );
    }

    // Build PayPal order payload
    const currency = "USD";
    const items = wanted.map((w) => ({
      name: w.title,
      sku: w.slug, // we'll read this back after capture
      quantity: String(w.qty),
      unit_amount: { currency_code: currency, value: w.price.toFixed(2) },
      category: "DIGITAL_GOODS" as const,
    }));

    const total = wanted.reduce((s, w) => s + w.price * w.qty, 0);
    const amount = {
      currency_code: currency,
      value: total.toFixed(2),
      breakdown: {
        item_total: { currency_code: currency, value: total.toFixed(2) },
      },
    };

    const token = await getAccessToken();

    const res = await fetch(`${baseUrlForPayPal()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount,
            items,
            // custom_id is handy if you want to carry any small metadata
            // custom_id: wanted.map(w => w.slug).join(",").slice(0,127),
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: "PayPal create order failed", details: json },
        { status: 500 }
      );
    }

    // Return the order id for the client-side PayPal Buttons to approve
    return NextResponse.json({ id: json.id });
  } catch (err: any) {
    console.error("paypal create-order error:", err?.message || err);
    return NextResponse.json(
      { error: "Create order error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
