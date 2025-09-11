'use client'

import { useState, useEffect, useMemo } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface CartItem {
  id: string            // product.id as string (e.g. "1")
  name: string
  price: number
  quantity: number
  image?: string
  url?: string
  description?: string
  fileGuid?: string
}

type PpResult = {
  success?: boolean
  orderId?: string
  email?: string | null
  items?: Array<{
    name: string
    qty: number
    unit: number
    downloadHref?: string
  }>
  error?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ppLoading, setPpLoading] = useState(false)
  const [ppResult, setPpResult] = useState<PpResult | null>(null)

  // PayPal client id (must be set in env as NEXT_PUBLIC_PAYPAL_CLIENT_ID)
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  // Load cart
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) setCartItems(JSON.parse(stored))
    } catch {
      /* ignore */
    }
  }, [])

  const updateCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
    setError(null)
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    updateCart(cartItems.map(item => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemove = (id: string) => updateCart(cartItems.filter(item => item.id !== id))
  const handleClear = () => updateCart([])

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  // Convert to backend payload once
  const lineItems = useMemo(() => {
    return cartItems
      .map(ci => {
        const productId = Number.parseInt(ci.id, 10)
        return Number.isFinite(productId)
          ? { productId, qty: Math.max(1, Number(ci.quantity) || 1) }
          : null
      })
      .filter(Boolean) as { productId: number; qty: number }[]
  }, [cartItems])

  // ============== Stripe (card) ==============
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty!')
      return
    }
    if (!lineItems.length) {
      setError('Could not resolve product IDs in your cart.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: lineItems }),
      })
      const data = await resp.json()
      if (!resp.ok || !data?.url) {
        console.error('Checkout error:', data)
        setError(data?.error || 'Sorry—couldn’t start checkout.')
        setLoading(false)
        return
      }
      window.location.href = data.url as string
    } catch (e) {
      console.error(e)
      setError('Network error starting checkout.')
      setLoading(false)
    }
  }

  // ============== PayPal (wallets) ==============
  const createPaypalOrder = async () => {
    // backend creates PayPal order from our cart
    const resp = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: lineItems }),
    })
    const data = await resp.json()
    if (!resp.ok || !data?.id) {
      setError(data?.error || 'Could not start PayPal checkout.')
      throw new Error('create-order failed')
    }
    return data.id as string
  }

  const capturePaypalOrder = async (orderID: string) => {
    setPpLoading(true)
    setError(null)
    try {
      const resp = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderID }),
      })
      const data: PpResult = await resp.json()
      if (!resp.ok || !data?.success) {
        setError(data?.error || 'PayPal capture failed.')
        setPpLoading(false)
        return
      }
      setPpResult(data)
      // Optional: clear cart on success
      updateCart([])
    } catch (e) {
      console.error(e)
      setError('Network error capturing PayPal payment.')
    } finally {
      setPpLoading(false)
    }
  }

  if (!cartItems.length && !ppResult) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Show success panel after PayPal capture (instant downloads) */}
      {ppResult?.success && (
        <div className="mb-8 p-4 border rounded bg-green-50">
          <p className="font-semibold mb-2">
            Payment successful{ppResult.email ? ` — receipt sent to ${ppResult.email}` : ''}.
          </p>
          {ppResult.items?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b">
                    <th className="py-2 pr-3">Item</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Unit (USD)</th>
                    <th className="py-2">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {ppResult.items.map((it, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="py-3 pr-3">{it.name}</td>
                      <td className="py-3 pr-3">{it.qty}</td>
                      <td className="py-3 pr-3">${it.unit.toFixed(2)}</td>
                      <td className="py-3">
                        {it.downloadHref ? (
                          <a
                            className="text-blue-600 hover:underline"
                            href={it.downloadHref}
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-500">We’ll email your files shortly</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}

      {/* Cart list (hidden after PayPal success since we clear it) */}
      {!!cartItems.length && (
        <ul className="divide-y divide-gray-200 mb-8">
          {cartItems.map(({ id, name, price, quantity, image }) => (
            <li key={id} className="flex items-center py-6">
              {image && (
                <img
                  src={image}
                  alt={name}
                  className="w-24 h-24 rounded object-cover mr-6"
                  loading="lazy"
                />
              )}
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-gray-700 mt-1">${price.toFixed(2)} each</p>
                <div className="mt-2 flex items-center space-x-2">
                  <label htmlFor={`qty-${id}`} className="mr-2 font-medium">
                    Quantity:
                  </label>
                  <input
                    id={`qty-${id}`}
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(id, Number(e.target.value))}
                    className="w-16 p-1 border rounded text-center"
                  />
                </div>
              </div>
              <div className="ml-6 flex flex-col items-end">
                <p className="text-lg font-bold mb-4">
                  ${(price * quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemove(id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Remove ${name} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Footer actions */}
      {!!cartItems.length && (
        <div className="flex flex-col gap-4 border-t border-gray-300 pt-6">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <div className="space-x-4">
              <button
                onClick={handleClear}
                disabled={loading || ppLoading}
                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading || ppLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? 'Redirecting…' : 'Checkout (Card)'}
              </button>
            </div>
          </div>

          {/* PayPal */}
          <div className="pt-2">
            {!paypalClientId ? (
              <div className="p-3 bg-yellow-50 border rounded text-yellow-800">
                Set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your environment to enable PayPal.
              </div>
            ) : (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  currency: 'USD',
                  intent: 'CAPTURE',
                  components: 'buttons',
                  // feel free to add "enable-funding" to surface Venmo/PayLater/etc
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', height: 45 }}
                  createOrder={async () => {
                    if (!lineItems.length) {
                      setError('Your cart is empty!')
                      throw new Error('empty-cart')
                    }
                    return await createPaypalOrder()
                  }}
                  onApprove={async (data) => {
                    if (!data.orderID) return
                    await capturePaypalOrder(data.orderID)
                  }}
                  onError={(err) => {
                    console.error(err)
                    setError('PayPal error. Please try again or use card checkout.')
                  }}
                  disabled={ppLoading || !lineItems.length}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
