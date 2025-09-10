// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { core, orders } from "@paypal/paypal-server-sdk";
import { productsById, productsBySlug } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPayPalClient() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Missing PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET");

  const env =
    process.env.NODE_ENV === "production"
      ? new core.LiveEnvironment(id, secret)
      : new core.SandboxEnvironment(id, secret);

  return new core.PayPalHttpClient(env);
}

/**
 * Expected JSON body:
 * {
 *   "items": [
 *     { "productId": 3, "quantity": 2 }    // preferred
 *     // or { "slug": "digital-wealth-ultimate-guide", "quantity": 1 }
 *   ]
 * }
 */
export async function POST(req: Request) {
  try {
    const { items } = await req.json().catch(() => ({ items: [] as any[] }));
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items supplied" }, { status: 400 });
    }

    // Build PayPal line items from your catalog
    const ppItems: any[] = [];
    let total = 0;

    for (const raw of items) {
      const qty = Math.max(1, Number(raw.quantity) || 1);
      const product =
        typeof raw.productId !== "undefined"
          ? productsById[Number(raw.productId)]
          : typeof raw.slug === "string"
          ? productsBySlug[raw.slug]
          : undefined;

      if (!product) continue;

      const unit = Number(product.price.toFixed(2));
      total += unit * qty;

      ppItems.push({
        name: product.title.slice(0, 120),
        quantity: String(qty),
        sku: product.slug, // we’ll use this later to generate download links
        unit_amount: { currency_code: "USD", value: unit.toFixed(2) },
      });
    }

    if (ppItems.length === 0) {
      return NextResponse.json({ error: "No valid products found" }, { status: 400 });
    }

    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: total.toFixed(2) },
            },
          },
          items: ppItems,
        },
      ],
    };

    const client = getPayPalClient();
    const reqCreate = new orders.OrdersCreateRequest();
    reqCreate.prefer("return=representation");
    reqCreate.requestBody(body);

    const resCreate = await client.execute(reqCreate);
    return NextResponse.json({ id: resCreate.result.id });
  } catch (err: any) {
    console.error("PayPal create-order error:", err?.message ?? err);
    return NextResponse.json({ error: "PayPal create order failed" }, { status: 500 });
  }
}
