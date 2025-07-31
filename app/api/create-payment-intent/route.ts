import { type NextRequest, NextResponse } from "next/server"

// Mock Stripe integration - replace with actual Stripe in production
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", metadata } = await request.json()

    // Simulate Stripe payment intent creation
    const paymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: "requires_payment_method",
      metadata,
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
