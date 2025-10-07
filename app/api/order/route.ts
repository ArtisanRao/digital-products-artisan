// app/api/order/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/data/products";
import { signPidToken, signPathToken } from "@/lib/download-token";

const VERCEL_ENV = process.env.VERCEL_ENV || "";
const IS_PROD_DEPLOY = VERCEL_ENV === "production";

/* ---------------- utils ---------------- */
function siteBase(req: NextRequest) {
  const envBase = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (envBase) return envBase.replace(/\/+$/, "");

  const vercelUrl = (process.env.VERCEL_URL || "").trim();
  if (vercelUrl) {
    const proto = IS_PROD_DEPLOY ? "https" : "http";
    return `${proto}://${vercelUrl.replace(/\/+$/, "")}`;
  }

  const hdr = req.headers.get("origin");
  if (hdr) return hdr.replace(/\/+$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function getStripe(): Stripe {
  const raw = process.env.STRIPE_SECRET_KEY ?? "";
  const key = raw.trim();
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (IS_PROD_DEPLOY && key.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY is a TEST key on a production deploy.");
  }
  if (key.startsWith("pk_") || key.startsWith("whsec_")) {
    throw new Error("STRIPE_SECRET_KEY is not a secret key. Use sk_live_* or rk_live_*.");
  }
  return new Stripe(key);
}

function productById(id: number) {
  return products.find((p) => Number(p.id) === Number(id)) || null;
}

function dlUrl(base: string, token: string) {
  return `${base}/api/download?token=${encodeURIComponent(token)}`;
}

/* -------------- core -------------- */
async function loadOrderJSON(req: NextRequest, orderId: string) {
  const base = siteBase(req);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(orderId, {
    expand: ["line_items"],
  });

  const isPaidOrComplete =
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required" ||
    session.status === "complete";

  if (!isPaidOrComplete) {
    return NextResponse.json(
      { error: "Order not paid/complete yet." },
      { status: 402 }
    );
  }

  // Try to resolve our product from metadata (set in /api/checkout)
  let pid: number | null = null;
  if (session.metadata?.productId) {
    const n = Number(session.metadata.productId);
    if (Number.isFinite(n)) pid = n;
  }

  const files: { label: string; href: string }[] = [];

  if (pid) {
    const p = productById(pid);
    if (p?.downloadPath) {
      // Use PID token (route will resolve to product.downloadPath safely)
      const token = signPidToken(pid);
      files.push({ label: p.title, href: dlUrl(base, token) });
    }
  }

  // Fallback demo links (ensure these exist under /private/files/)
  if (files.length === 0) {
    const t1 = signPathToken("files/sample-product.zip");
    const t2 = signPathToken("files/bonus-checklist.pdf");
    files.push(
      { label: "Download: sample-product.zip", href: dlUrl(base, t1) },
      { label: "Bonus: checklist.pdf", href: dlUrl(base, t2) }
    );
  }

  return NextResponse.json({
    orderId: session.id,
    livemode: session.livemode,
    currency: session.currency,
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    files,
  });
}

/* -------------- handlers -------------- */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("order") || "";
    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }
    return await loadOrderJSON(req, orderId);
  } catch (err: any) {
    console.error("[order] get error:", err);
    return NextResponse.json(
      { error: err?.message || "order_error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const orderId = String(body?.order || "");
    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }
    return await loadOrderJSON(req, orderId);
  } catch (err: any) {
    console.error("[order] post error:", err);
    return NextResponse.json(
      { error: err?.message || "order_error" },
      { status: 500 }
    );
  }
}
