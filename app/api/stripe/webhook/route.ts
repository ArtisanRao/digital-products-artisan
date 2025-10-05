// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { signDownloadToken } from "@/lib/download-token";
import { productsById } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2024-06-20";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key, { apiVersion: STRIPE_API_VERSION });
  return _stripe;
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new NextResponse(
      "Missing stripe-signature or STRIPE_WEBHOOK_SECRET",
      { status: 400 }
    );
  }

  // Stripe needs the raw body (App Router gives it via arrayBuffer)
  const rawBody = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email || session.customer_email || undefined;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    // Multi-item metadata (optional)
    let items: Array<{ id: number; qty: number }> | null = null;
    try {
      if (session.metadata?.items) items = JSON.parse(session.metadata.items);
    } catch {
      items = null;
    }

    const links: Array<{ id: number; url: string }> = [];

    if (items && items.length) {
      for (const { id } of items) {
        const p = productsById[id]?.downloadPath;
        if (!p) continue;
        const token = signDownloadToken({ path: p }); // ttl default 7d
        links.push({
          id,
          url: `${baseUrl}/api/download?token=${encodeURIComponent(token)}`,
        });
      }
    } else {
      // Fallback: single productId
      const pid = Number(session.metadata?.productId);
      const p = Number.isFinite(pid) ? productsById[pid]?.downloadPath : undefined;
      if (p) {
        const token = signDownloadToken({ path: p });
        links.push({
          id: pid,
          url: `${baseUrl}/api/download?token=${encodeURIComponent(token)}`,
        });
      }
    }

    // Optional: email the links
    if (email && links.length) {
      const list = links
        .map((l) => `<li><a href="${l.url}">Download product #${l.id}</a></li>`)
        .join("");
      try {
        await fetch(`${baseUrl}/api/send-email`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Your Digital Downloads",
            html: `<p>Thanks for your purchase!</p><ul>${list}</ul><p>Links expire in 7 days.</p>`,
          }),
        });
      } catch (e) {
        console.error("Failed to send download email", e);
      }
    }

    console.log("✅ checkout.session.completed → links:", links);
  }

  return NextResponse.json({ received: true });
}
