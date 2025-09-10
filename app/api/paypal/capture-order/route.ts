// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { core, orders } from "@paypal/paypal-server-sdk";
import { productsBySlug, products } from "@/data/products";
import { signDownloadToken } from "@/lib/download-token";

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
 * { "orderID": "<paypal-order-id>" }
 */
export async function POST(req: Request) {
  try {
    const { orderID } = await req.json().catch(() => ({}));
    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
    }

    const client = getPayPalClient();

    // 1) Capture the order
    const capReq = new orders.OrdersCaptureRequest(orderID);
    capReq.requestBody({});
    const capRes = await client.execute(capReq);

    // 2) Read full order (for line items)
    const getRes = await client.execute(new orders.OrdersGetRequest(orderID));
    const unit = (getRes.result.purchase_units && getRes.result.purchase_units[0]) || {};
    const purchasedItems: any[] = unit.items || [];

    const secret = process.env.DOWNLOAD_SECRET;
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Build per-item download links using SKU (slug) you sent in create-order
    const downloads = purchasedItems.map((it: any) => {
      const slug: string | undefined = it?.sku;
      const local =
        (slug ? productsBySlug[slug] : undefined) ||
        products.find((p) => p.title === it?.name);

      let href: string | undefined;
      if (local?.downloadPath && secret) {
        const token = signDownloadToken({ p: local.downloadPath, exp }, secret);
        href = `/api/download?token=${encodeURIComponent(token)}`;
      }

      return {
        name: it?.name,
        quantity: Number(it?.quantity ?? 1),
        unit: Number(it?.unit_amount?.value ?? 0),
        slug: local?.slug,
        href,
      };
    });

    return NextResponse.json({
      ok: true,
      orderID,
      status: capRes.result?.status,
      downloads,
    });
  } catch (err: any) {
    console.error("PayPal capture-order error:", err?.message ?? err);
    return NextResponse.json({ error: "PayPal capture order failed" }, { status: 500 });
  }
}
