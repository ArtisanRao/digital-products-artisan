// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { productsBySlug } from "@/data/products";
import { signDownloadToken } from "@/lib/download-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const json = await res.json();
  return json.access_token as string;
}

export async function POST(req: Request) {
  try {
    const { orderId } = (await req.json()) as { orderId?: string };
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const token = await getAccessToken();
    const res = await fetch(
      `${baseUrlForPayPal()}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: "Capture failed", details: data },
        { status: 500 }
      );
    }

    // Build per-item download links when we can read SKU(s)
    const downloadSecret = process.env.DOWNLOAD_SECRET;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const out: {
      id: string;
      status: string;
      downloads?: { name: string; url: string }[];
    } = { id: data.id, status: data.status };

    const pu = Array.isArray(data.purchase_units) ? data.purchase_units[0] : null;
    const items: any[] | undefined = pu?.items; // present on some responses
    if (items?.length && downloadSecret) {
      const links: { name: string; url: string }[] = [];
      for (const it of items) {
        const slug: string | undefined = it.sku;
        const local = slug ? productsBySlug[slug] : undefined;
        if (local?.downloadPath) {
          const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
          const token = signDownloadToken({ p: local.downloadPath, exp }, downloadSecret);
          links.push({
            name: local.title,
            url: `${siteUrl}/api/download?token=${encodeURIComponent(token)}`,
          });
        }
      }
      if (links.length) out.downloads = links;
    }

    return NextResponse.json(out);
  } catch (err: any) {
    console.error("paypal capture-order error:", err?.message || err);
    return NextResponse.json(
      { error: "Capture order error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
