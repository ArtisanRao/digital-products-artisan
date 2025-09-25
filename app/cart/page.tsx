"use client";

import { useEffect, useMemo, useState } from "react";
import { getPreferredCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import * as cart from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<cart.CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("eur");

  // Currency bootstrap + listener (matches your header picker)
  useEffect(() => {
    const initial = (getPreferredCurrency() || "eur").toLowerCase();
    setCurrency(initial);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string | undefined>).detail;
      setCurrency((detail || getPreferredCurrency() || "eur").toLowerCase());
    };
    window.addEventListener("currency:change", onChange as EventListener);
    return () => window.removeEventListener("currency:change", onChange as EventListener);
  }, []);

  // Sync with lib/cart (single source of truth)
  useEffect(() => {
    // Initial load
    setItems(cart.getCart());
    setHydrated(true);

    // Subscribe to updates (cart emits "cart-update" with detail)
    const unsubscribe = cart.onChange((_count, detail) => {
      setItems(detail.items);
    });
    return unsubscribe;
  }, []);

  // Helpers
  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  const formatMoney = (n: number) => {
    const code = (currency || "eur").toUpperCase();
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(n);
    }
  };

  // Mutations go through lib/cart so events & storage stay consistent
  const handleQuantityChange = (id: string, qty: number) => {
    if (qty < 1) return;
    cart.setQty(id, qty);
    setError(null);
  };
  const handleRemove = (id: string) => cart.removeFromCart(id);
  const handleClear = () => cart.clearCart();

  // Checkout via /api/checkout (multi-item). Your API resolves id/slug either way.
  const handleCheckout = async () => {
    if (!items.length) {
      setError("Your cart is empty!");
      return;
    }

    // API supports { items: [{ slug, quantity }] } and resolves slug/id internally
    const payload = {
      items: items.map((it) => ({ slug: it.id, quantity: Math.max(1, Number(it.qty) || 1) })),
      currency, // optional server-side
    };

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.url) {
        console.error("Checkout error:", data);
        setError(data?.error || "Sorry—couldn’t start checkout.");
        setLoading(false);
        return;
      }

      window.location.href = data.url as string; // ⟶ Stripe Checkout (or your gateway)
    } catch (e) {
      console.error(e);
      setError("Network error starting checkout.");
      setLoading(false);
    }
  };

  // Hydration guard
  if (!hydrated) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="mb-2 text-4xl font-bold">Loading cart…</h1>
        <p className="text-gray-600">Please wait.</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-4xl font-bold">Your Cart</h1>

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
              <img
                src={image}
                alt={title}
                className="mr-6 h-24 w-24 rounded object-cover"
                loading="lazy"
              />
            ) : null}

            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{title}</h2>
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
                  onChange={(e) => handleQuantityChange(id, Number(e.target.value))}
                  className="w-16 rounded border p-1 text-center"
                />
              </div>
            </div>

            <div className="ml-6 flex flex-col items-end">
              <p className="mb-4 text-lg font-bold">{formatMoney(price * (qty || 0))}</p>
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
        <p className="text-2xl font-bold">Total: {formatMoney(totalPrice)}</p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleClear}
            disabled={loading}
            className="hidden sm:inline-flex"
            variant="secondary"
          >
            Clear Cart
          </Button>

          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            {loading ? "Redirecting…" : "Checkout"}
          </Button>
        </div>
      </div>
    </main>
  );
}
