"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as cart from "@/lib/cart";

type Line = cart.CartItem;

export default function CartPage() {
  const [items, setItems] = useState<Line[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to the single source of truth (lib/cart)
  useEffect(() => {
    const sync = (c: number, detail: { items: Line[]; count: number; total: number }) => {
      setItems(detail.items);
      setCount(detail.count);
      setTotal(detail.total);
      setHydrated(true);

      // bridge for header badges or legacy listeners
      try {
        localStorage.setItem("cartCount", String(detail.count));
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: detail.count, items: detail.items } }));
      } catch {}
    };

    // initial snapshot
    sync(cart.getCartCount(), { items: cart.getCart(), count: cart.getCartCount(), total: cart.getCartTotal() });

    // live updates
    const unsubscribe = cart.onChange(sync);
    return unsubscribe;
  }, []);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

  const handleQty = (id: string, q: number) => cart.setQty(id, Math.max(1, Math.floor(q)));
  const handleRemove = (id: string) => cart.removeFromCart(id);
  const handleClear = () => cart.clearCart();

  const handleCheckout = async () => {
    if (!items.length) {
      setError("Your cart is empty!");
      return;
    }
    setLoading(true);
    setError(null);

    // Send ids through API; server resolves id/slug to product
    const payload = {
      items: items.map((it) => ({ slug: it.id, quantity: it.qty })),
    };

    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.url) {
        setError(data?.error || "Sorry—couldn’t start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url as string;
    } catch (e) {
      console.error(e);
      setError("Network error starting checkout.");
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Loading cart…</h1>
        <p className="text-gray-600">Please wait.</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
        <div className="mt-6">
          <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/products">Shop Products</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Your Cart</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700" aria-live="polite">
          {error}
        </div>
      )}

      <ul className="mb-8 divide-y divide-gray-200">
        {items.map(({ id, title, price, qty, image }) => (
          <li key={id} className="flex items-center py-6">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={title} className="mr-6 h-24 w-24 rounded object-cover" loading="lazy" />
            ) : null}

            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-gray-700">{formatMoney(price)} each</p>

              <div className="mt-2 flex items-center space-x-2">
                <label htmlFor={`qty-${id}`} className="mr-2 font-medium">
                  Quantity:
                </label>
                <input
                  id={`qty-${id}`}
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => handleQty(id, Number(e.target.value))}
                  className="w-16 rounded border p-1 text-center"
                />
              </div>
            </div>

            <div className="ml-6 flex flex-col items-end">
              <p className="mb-4 text-lg font-bold">{formatMoney(price * qty)}</p>
              <button
                onClick={() => handleRemove(id)}
                className="font-semibold text-red-600 hover:text-red-800"
                aria-label={`Remove ${title} from cart`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 border-t border-gray-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-bold">Total: {formatMoney(total)}</p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleClear}
            disabled={loading}
            className="hidden sm:inline-flex"
            variant="secondary"
            data-action="clear-cart"
          >
            Clear Cart
          </Button>
          <Button onClick={handleCheckout} disabled={loading} className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto">
            {loading ? "Redirecting…" : "Checkout"}
          </Button>
        </div>
      </div>
    </main>
  );
}
