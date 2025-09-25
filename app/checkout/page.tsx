"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PaymentForm from "@/components/payment-form";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const { user } = useAuth(); // optional; we won't force-login

  // Optional: scroll to top when arriving here
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePaymentSuccess = (orderId: string) => {
    router.push(`/order-confirmation/${orderId}`);
  };

  // ---- Empty cart friendly state (no redirects) ---------------------------
  if (!items || items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

        {!user && (
          <p className="mb-3 text-sm text-gray-600">
            You’re checking out as a <strong>guest</strong>. You can{" "}
            <Link href="/login?redirect=/checkout" className="underline">
              sign in
            </Link>{" "}
            if you want to save your order to your account.
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Add a product to your cart and come back to complete your purchase.
            </p>
            <div className="flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Browse products
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted/40"
              >
                View cart
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
  // ------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      {!user && (
        <p className="mb-6 text-sm text-gray-600">
          Checking out as a <strong>guest</strong>.{" "}
          <Link href="/login?redirect=/checkout" className="underline">
            Sign in
          </Link>{" "}
            (optional) to save your order to your account.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={String(item.id ?? item.title)}   // ← no slug usage
                  className="flex items-center space-x-4"
                >
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
                    <p className="font-semibold">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${Number(total).toFixed(2)}</span>
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
  );
}
