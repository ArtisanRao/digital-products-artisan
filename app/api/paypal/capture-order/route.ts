// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server"
import checkoutNodeJssdk from "@paypal/checkout-server-sdk"
import { productsById } from "@/data/products"
import { signDownloadToken } from "@/lib/download-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error("Missing PayPal credentials")
  const env =
    process.env.PAYPAL_ENV === "live"
      ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
      : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
  return new checkoutNodeJssdk.core.PayPalHttpClient(env)
}

export async function POST(req: Request) {
  try {
    const { orderId } = (await req.json()) as { orderId?: string }
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 })

    const client = getPayPalClient()
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    const { result } = await client.execute(request)
    const status = result?.status
    const payerEmail = result?.payer?.email_address || null
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin

    const links: Array<{ id: number; title: string; qty: number; unit: number; url: string }> = []

    if (status === "COMPLETED") {
      const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
      const items = result?.purchase_units?.[0]?.items || []
      for (const it of items) {
        const id = Number(it?.sku)
        const p = productsById[id]
        if (!p?.downloadPath) continue
        const token = signDownloadToken({ p: p.downloadPath, exp })
        links.push({
          id,
          title: p.title,
          qty: Number(it?.quantity || 1),
          unit: Number(it?.unit_amount?.value || p.price),
          url: `${baseUrl}/api/download?token=${token}`,
        })
      }
    }

    return NextResponse.json({ status, payerEmail, links })
  } catch (err: any) {
    console.error("PayPal capture-order error:", err?.message || err)
    return NextResponse.json({ error: "PayPal capture-order failed" }, { status: 500 })
  }
}
