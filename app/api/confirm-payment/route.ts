import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, items, userEmail } = await request.json()

    // Simulate payment confirmation and order creation
    const order = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      paymentIntentId,
      items,
      userEmail,
      status: "completed",
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
      downloadLinks: items.map((item: any) => ({
        productId: item.id,
        productTitle: item.title,
        downloadUrl: `/downloads/${item.id}/${Math.random().toString(36).substr(2, 9)}`,
      })),
    }

    // In production, save order to database and send confirmation email
    console.log("Order created:", order)

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
