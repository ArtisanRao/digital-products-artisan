// app/api/order/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { productsById, productsBySlug } from "@/data/products";

const VERCEL_ENV = process.env.VERCEL_ENV || "";
const IS_PROD_DEPLOY = VERCEL_ENV === "production";

function getStripe(): Stripe {
  const raw = process.env.STRIPE_SECRET_KEY ?? "";
  const key = raw.trim();
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (IS_PROD_DEPLOY && key.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY is test on a production deploy.");
  }
  return new Stripe(key);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const order =
      url.searchParams.get("order") || url.searchParams.get("session_id");
    if (!order) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(order, {
      expand: ["line_items.data.price.product"],
    });

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete" ||
      session.status === "paid";
    if (!paid) {
      return NextResponse.json(
        { error: "Order not paid/complete yet." },
        { status: 403 }
      );
    }

    // Prefer our metadata (we set this in /api/checkout)
    const meta = session.metadata || {};
    const files: { name: string; href: string }[] = [];

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `${new URL(req.url).protocol}//${new URL(req.url).host}`;

    const addProductFiles = (idOrSlug: string) => {
      const p =
        productsById[Number(idOrSlug)] ||
        productsBySlug[String(idOrSlug)] ||
        null;
      if (!p) return;
      if (p.downloadPath) {
        const fname = p.downloadPath.split("/").pop() || "download.bin";
        files.push({
          name: fname,
          href: `${origin}/api/download?order=${encodeURIComponent(
            session.id
          )}&productId=${encodeURIComponent(String(p.id))}`,
        });
      }
    };

    if (meta.kind === "product" && meta.productId) {
      addProductFiles(String(meta.productId));
    } else if (meta.kind === "bundle") {
      // Optional: if you add bundle composition later, push each included product here.
      // For now we expose nothing unless you wire bundles to products with downloadPath.
    } else {
      // Fallback: try to infer from line items’ product names/slugs
      const items = session.line_items?.data || [];
      for (const li of items) {
        const productObj = (li.price?.product as Stripe.Product | null) || null;
        const slug =
          productObj?.metadata?.slug ||
          productObj?.metadata?.product_slug ||
          "";
        if (slug && productsBySlug[slug]) addProductFiles(slug);
      }
    }

    return NextResponse.json({
      ok: true,
      order: session.id,
      customer_name: session.customer_details?.name ?? "",
      customer_email: session.customer_details?.email ?? "",
      files,
    });
  } catch (err: any) {
    console.error("Order GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Order lookup error" },
      { status: 500 }
    );
  }
}
