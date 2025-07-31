import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Simulate newsletter subscription
    console.log(`Newsletter subscription: ${email}`)

    // Send welcome email with starter pack
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Welcome! Your Free Starter Pack is Ready",
        template: "newsletter",
        data: {
          name: name || "Creator",
          starterPackUrl: "/downloads/starter-pack.zip",
        },
      }),
    })

    // Set up automated email sequence
    await setupEmailSequence(email, name)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    })
  } catch (error) {
    console.error("Newsletter subscription failed:", error)
    return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}

async function setupEmailSequence(email: string, name: string) {
  // Simulate setting up automated email sequence
  const sequence = [
    {
      delay: 1, // 1 day
      subject: "Getting Started with Digital Products",
      template: "educational",
      data: { name, topic: "getting-started" },
    },
    {
      delay: 3, // 3 days
      subject: "Top 5 Digital Products for Beginners",
      template: "educational",
      data: { name, topic: "top-products" },
    },
    {
      delay: 7, // 1 week
      subject: "Special Offer: 20% Off Your First Purchase",
      template: "promotional",
      data: { name, discount: "20%", code: "WELCOME20" },
    },
  ]

  console.log(`Email sequence set up for ${email}:`, sequence)
}
