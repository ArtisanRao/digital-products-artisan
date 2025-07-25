import { type NextRequest, NextResponse } from "next/server"

interface EmailData {
  to: string
  subject: string
  template: "welcome" | "purchase-confirmation" | "newsletter" | "affiliate-welcome"
  data: any
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, template, data }: EmailData = await request.json()

    // Simulate email sending - replace with actual email service (SendGrid, Mailgun, etc.)
    const emailContent = generateEmailContent(template, data)

    console.log(`Sending email to ${to}:`, {
      subject,
      template,
      content: emailContent,
    })

    // Simulate email delivery delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
    })
  } catch (error) {
    console.error("Email sending failed:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

function generateEmailContent(template: string, data: any): string {
  switch (template) {
    case "welcome":
      return `
        <h1>Welcome to Digital Products Artisan!</h1>
        <p>Hi ${data.name},</p>
        <p>Thank you for joining our community of creators and entrepreneurs.</p>
        <p>As a welcome gift, here's your free starter pack: <a href="${data.starterPackUrl}">Download Now</a></p>
      `
    case "purchase-confirmation":
      return `
        <h1>Your Order is Ready!</h1>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your purchase. Your digital products are ready for download:</p>
        <ul>
          ${data.items
            .map(
              (item: any) => `
            <li><strong>${item.title}</strong> - <a href="${item.downloadUrl}">Download</a></li>
          `,
            )
            .join("")}
        </ul>
        <p>Order ID: ${data.orderId}</p>
      `
    case "newsletter":
      return `
        <h1>Welcome to our Newsletter!</h1>
        <p>Thank you for subscribing. Here's your free starter pack: <a href="${data.starterPackUrl}">Download Now</a></p>
      `
    case "affiliate-welcome":
      return `
        <h1>Welcome to our Affiliate Program!</h1>
        <p>Hi ${data.name},</p>
        <p>Your affiliate account is ready. Your unique affiliate ID is: ${data.affiliateId}</p>
        <p><a href="${data.dashboardUrl}">Access your dashboard</a></p>
      `
    default:
      return "<p>Thank you for your interest in Digital Products Artisan!</p>"
  }
}
