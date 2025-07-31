"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PaymentForm from "@/components/payment-form"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const { user } = useAuth()

  // Handle redirects in useEffect so they only run on the client
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
    } else if (items.length === 0) {
      router.push("/cart")
    }
  }, [user, items, router])

  // While the redirect happens, don't render the page
  if (!user || items.length === 0) {
    return null
  }

  const handlePaymentSuccess = (orderId: string) => {
    router.push(`/order-confirmation/${orderId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <PaymentForm onSuccess={handlePaymentSuccess} />
        </div>
      </div>
    </div>
  )
}
