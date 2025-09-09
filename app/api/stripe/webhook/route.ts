// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { signDownloadToken } from "@/lib/download-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Lazily create Stripe so type/version literals don't break builds
let _stripe: Stripe | null = null
function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    // Only throw when invoked (not at import/build time)
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  _stripe = new Stripe(key) // <-- no apiVersion here
  return _stripe
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return new NextResponse("Missing stripe-signature or STRIPE_WEBHOOK_SECRET", { status: 400 })
  }

  // Raw body for signature verification
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = Number(session.metadata?.productId)
    const email = session.customer_details?.email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin

    // 7-day download link
    const token = signDownloadToken({ pid: productId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
    const downloadUrl = `${baseUrl}/api/download?token=${token}`

    // Optional: email the buyer a link
    if (email) {
      try {
        await fetch(`${baseUrl}/api/send-email`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: "Your Digital Download",
            html: `
              <p>Thanks for your purchase!</p>
              <p><a href="${downloadUrl}">Click here to download your files</a>.
              This link will work for 7 days.</p>
            `,
          }),
        })
      } catch (e) {
        console.error("Failed to send download email", e)
      }
    }

    console.log("✅ Checkout completed; download link:", downloadUrl)
  }

  return NextResponse.json({ received: true })
}
