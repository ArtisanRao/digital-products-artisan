// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server"
import checkoutNodeJssdk from "@paypal/checkout-server-sdk"
import { productsById } from "@/data/products"

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

type LineItemIn = { productId: number | string; qty?: number }

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: LineItemIn[] }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 })
    }

    // Validate on server, build canonical cart
    const normalized = items
      .map(({ productId, qty }) => {
        const p = productsById[Number(productId)]
        if (!p) return null
        const quantity = Math.max(1, Number(qty) || 1)
        return { p, quantity }
      })
      .filter(Boolean) as { p: typeof productsById[number]; quantity: number }[]

    if (!normalized.length) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 })
    }

    const grand = normalized.reduce((sum, { p, quantity }) => sum + p.price * quantity, 0)

    const purchaseUnit: any = {
      amount: {
        currency_code: "USD",
        value: grand.toFixed(2),
        breakdown: {
          item_total: { currency_code: "USD", value: grand.toFixed(2) },
        },
      },
      items: normalized.map(({ p, quantity }) => ({
        name: p.title.slice(0, 127),
        sku: String(p.id), // we'll use this to map back to product
        unit_amount: { currency_code: "USD", value: p.price.toFixed(2) },
        quantity: String(quantity),
        category: "DIGITAL_GOODS",
      })),
    }

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [purchaseUnit],
      application_context: {
        brand_name: "Digital Products Artisan",
        user_action: "PAY_NOW",
      },
    })

    const client = getPayPalClient()
    const order = await client.execute(request)
    return NextResponse.json({ id: order.result.id })
  } catch (err: any) {
    console.error("PayPal create-order error:", err?.message || err)
    return NextResponse.json({ error: "PayPal create-order failed" }, { status: 500 })
  }
}
