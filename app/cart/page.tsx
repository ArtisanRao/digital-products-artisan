'use client'

import { useState, useEffect } from 'react'

// ✅ Extend global window to include Snipcart
declare global {
  interface Window {
    Snipcart?: {
      api: {
        items: {
          add: (item: any) => void
          clear: () => Promise<void>
        }
      }
      theme: {
        cart: {
          open: () => void
        }
      }
    }
  }
}

interface CartItem {
  id: string
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

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCartItems(JSON.parse(storedCart))
  }, [])

  const updateCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
    setError(null)
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
    updateCart(updated)
  }

  const handleRemove = (id: string) => {
    const filtered = cartItems.filter(item => item.id !== id)
    updateCart(filtered)
  }

  const handleClear = () => {
    updateCart([])
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty!')
      return
    }

    if (typeof window === 'undefined' || !window.Snipcart?.api?.items) {
      setError('Snipcart is not loaded yet. Please try again in a moment.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await window.Snipcart.api.items.clear()

      cartItems.forEach(item => {
        window.Snipcart!.api.items.add({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          url: item.url || window.location.href,
          ...(item.fileGuid && { fileGuid: item.fileGuid }),
        })
      })

      window.Snipcart.api.theme.cart.open()
    } catch {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!cartItems.length)
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
      </main>
    )

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
                  onChange={(e) =>
                    handleQuantityChange(id, Number(e.target.value))
                  }
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
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </main>
  )
}
