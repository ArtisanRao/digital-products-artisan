// components/paypal-button.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type LineItem = { productId: number; qty?: number }

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PayPalButton({
  items,
  className,
}: {
  items: LineItem[]
  className?: string
}) {
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  const payload = useMemo(
    () => ({ items: items.map((i) => ({ productId: i.productId, qty: i.qty ?? 1 })) }),
    [items]
  )

  useEffect(() => {
    if (!clientId) return
    if (window.paypal) {
      setReady(true)
      return
    }
    const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=USD&intent=capture&components=buttons`
    const s = document.createElement("script")
    s.src = src
    s.async = true
    s.onload = () => setReady(true)
    s.onerror = () => setReady(false)
    document.body.appendChild(s)
  }, [clientId])

  useEffect(() => {
    if (!ready || !window.paypal || !containerRef.current) return

    window.paypal
      .Buttons({
        style: { layout: "vertical", shape: "rect", label: "paypal" },

        // Create order on our server (trusted prices)
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.error || "Unable to create order")
          return data.id
        },

        // Capture on our server, then redirect to confirmation
        onApprove: async (data: any) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          })
          const out = await res.json()
          if (out?.status !== "COMPLETED") {
            throw new Error("Payment not completed")
          }
          // Reuse your existing confirmation route
          const url = new URL(window.location.origin + "/order-confirmation")
          url.searchParams.set("provider", "paypal")
          url.searchParams.set("order_id", data.orderID)
          // Optional: pass quick summary so the page can show instantly
          if (Array.isArray(out.links)) {
            sessionStorage.setItem("paypal_links_" + data.orderID, JSON.stringify(out.links))
          }
          window.location.assign(url.toString())
        },

        onError: (err: any) => {
          console.error("PayPal error:", err)
          alert("PayPal checkout failed. Please try again.")
        },
      })
      .render(containerRef.current)
  }, [ready, payload])

  if (!clientId) {
    return (
      <div className={className}>
        <button
          className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700"
          disabled
          title="Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID"
        >
          PayPal (not configured)
        </button>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
