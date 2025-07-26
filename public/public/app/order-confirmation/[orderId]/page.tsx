"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface OrderDetails {
  id: string
  total: number
  items: Array<{
    id: number
    title: string
    downloadUrl: string
  }>
  customerEmail: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Mock order data - replace with actual API call
    setOrder({
      id: orderId,
      total: 79.99,
      items: [
        {
          id: 1,
          title: "Ultimate AI Prompt Pack",
          downloadUrl: "/downloads/ai-prompts.zip",
        },
        {
          id: 2,
          title: "Canva Template Bundle",
          downloadUrl: "/downloads/canva-templates.zip",
        },
      ],
      customerEmail: "customer@example.com",
    })
  }, [orderId])

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your digital products are ready for download.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left">
              <h3 className="font-semibold mb-3">Your Downloads:</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.title}</span>
                    <Button size="sm" asChild>
                      <a href={item.downloadUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Paid:</span>
                <span className="text-xl font-bold text-green-600">${order.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            Confirmation email sent to {order.customerEmail}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
