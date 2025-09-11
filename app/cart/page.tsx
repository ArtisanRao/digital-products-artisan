'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPreferredCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;       // product.id as string
  name: string;
  price: number;    // base number; rendered/charged in selected currency
  quantity: number;
  image?: string;
  url?: string;
  description?: string;
  fileGuid?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('usd');

  // Currency bootstrap + live updates from header picker
  useEffect(() => {
    setCurrency(getPreferredCurrency());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string | undefined>).detail;
      setCurrency((detail || getPreferredCurrency()).toLowerCase());
    };
    window.addEventListener('currency:change', onChange as EventListener);
    return () => window.removeEventListener('currency:change', onChange as EventListener);
  }, []);

  // Helper to persist + broadcast
  const persistAndBroadcast = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem('cartCount', String(count));
    try {
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count, items } }));
    } catch {}
  };

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart');
      const items = stored ? (JSON.parse(stored) as CartItem[]) : [];
      setCartItems(items);
      // ensure header is in sync on page load
      persistAndBroadcast(items);
    } catch {
      /* ignore parse errors */
    }
  }, []);

  // Stay in sync if other parts of the app update the cart
  useEffect(() => {
    const onCartUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ items?: CartItem[] }>).detail;
      if (detail?.items) {
        setCartItems(detail.items);
      } else {
        // fallback: read from storage
        try {
          const raw = localStorage.getItem('cart');
          setCartItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
        } catch {}
      }
    };
    window.addEventListener('cart:updated', onCartUpdated as EventListener);
    return () => window.removeEventListener('cart:updated', onCartUpdated as EventListener);
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    persistAndBroadcast(items);
    setError(null);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCart(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemove = (id: string) => updateCart(cartItems.filter((item) => item.id !== id));
  const handleClear = () => updateCart([]);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const formatMoney = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(n);

  // Stripe Checkout (multi-item) via /api/checkout — send chosen currency
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty!');
      return;
    }

    const lineItems = cartItems
      .map((ci) => {
        const productId = Number.parseInt(ci.id, 10);
        return Number.isFinite(productId)
          ? { productId, qty: Math.max(1, Number(ci.quantity) || 1) }
          : null;
      })
      .filter(Boolean) as { productId: number; qty: number }[];

    if (!lineItems.length) {
      setError('Could not resolve product IDs in your cart.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: lineItems, currency }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.url) {
        console.error('Checkout error:', data);
        setError(data?.error || 'Sorry—couldn’t start checkout.');
        setLoading(false);
        return;
      }

      window.location.href = data.url as string;
    } catch (e) {
      console.error(e);
      setError('Network error starting checkout.');
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" aria-live="polite">
          {error}
        </div>
      )}

      <ul className="divide-y divide-gray-200 mb-8">
        {cartItems.map(({ id, name, price, quantity, image }) => (
          <li key={id} className="flex items-center py-6">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="w-24 h-24 rounded object-cover mr-6"
                loading="lazy"
              />
            )}
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-gray-700 mt-1">{formatMoney(price)} each</p>
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
              <p className="text-lg font-bold mb-4">{formatMoney(price * quantity)}</p>
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-300 pt-6">
        <p className="text-2xl font-bold">Total: {formatMoney(totalPrice)}</p>
        <div className="flex gap-3 justify-end">
          {/* Hide Clear Cart on mobile */}
          <Button
            onClick={handleClear}
            disabled={loading}
            className="hidden sm:inline-flex clear-cart-btn"
            variant="secondary"
            data-action="clear-cart"
          >
            Clear Cart
          </Button>

          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          >
            {loading ? 'Redirecting…' : 'Checkout'}
          </Button>
        </div>
      </div>
    </main>
  );
}
