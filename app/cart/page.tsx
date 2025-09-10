'use client'

import { useState, useEffect, useMemo } from 'react'

interface CartItem {
  id: string            // expects product.id as a string (e.g. "1")
  name: string
  price: number
  quantity: number
  image?: string
  url?: string
  description?: string
  fileGuid?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) setCartItems(JSON.parse(stored))
    } catch {
      // ignore parse errors
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

  const handleRemove = (id: string) => {
    updateCart(cartItems.filter(item => item.id !== id))
  }

  const handleClear = () => updateCart([])

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  // 🚀 Stripe Checkout (multi-item) via /api/checkout
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty!')
      return
    }

    // Convert string ids -> numeric productIds expected by /api/checkout
    const lineItems = cartItems
      .map(ci => {
        const productId = Number.parseInt(ci.id as string, 10)
        return Number.isFinite(productId)
          ? { productId, qty: Math.max(1, Number(ci.quantity) || 1) }
          : null
      })
      .filter(Boolean) as { productId: number; qty: number }[]

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

      // Redirect to Stripe Checkout
      window.location.href = data.url as string
    } catch (e) {
      console.error(e)
      setError('Network error starting checkout.')
    } finally {
      // keep loading state until redirect or error
    }
  }

  if (!cartItems.length) {
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

      <div className="flex justify-between items-center border-t border-gray-300 pt-6">
        <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <div className="space-x-4">
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Redirecting…' : 'Checkout'}
          </button>
        </div>
      </div>
    </main>
  )
}
