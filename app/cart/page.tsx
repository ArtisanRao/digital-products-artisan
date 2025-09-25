// app/cart/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import * as cart from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { getPreferredCurrency } from "@/lib/currency";

export default function CartPage() {
  const [items, setItems] = useState<cart.CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("eur");

  // Hydrate + subscribe to cart changes
  useEffect(() => {
    setItems(cart.getCart());
    setHydrated(true);

    const unsub = cart.onChange((_count, detail) => setItems(detail.items));
    return () => unsub();
  }, []);

  // Keep currency in sync with header selector
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

  const total = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  const fmt = (n: number) => {
    const code = (currency || "eur").toUpperCase();
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(n); }
    catch { return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n); }
  };

  const handleQty = (id: string, qty: number) => {
    if (qty < 1) return;
    cart.setQty(id, qty);
  };
  const handleRemove = (id: string) => cart.removeFromCart(id);
  const handleClear = () => cart.clearCart();

  // Stripe Checkout (multi-item) via /api/checkout → resolve by slug/id on server
  const handleCheckout = async () => {
    if (!items.length) {
      setErr("Your cart is empty!");
      return;
    }
    setLoading(true);
    setErr(null);

    try {
      // Your /api/checkout POST handler supports the "items" branch that resolves by slug/id:
      //    items: [{ slug, quantity }]
      const payload = {
        items: items.map((it) => ({ slug: it.id, quantity: Math.max(1, Number(it.qty) || 1) })),
        currency: currency.toUpperCase(),
      };

      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (resp.ok && data?.url) {
        window.location.href = data.url as string; // → Stripe Checkout
        return;
      }

      console.error("Checkout error:", data);
      setErr(data?.error || "Sorry—couldn’t start checkout.");
    } catch (e) {
      console.error(e);
      setErr("Network error starting checkout.");
    } finally {
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
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

      {err && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700" aria-live="polite">
          {err}
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

            <div className="flex-grow min-w-0">
              <h2 className="text-xl font-semibold truncate">{title}</h2>
              <p className="mt-1 text-gray-700">{fmt(price)} each</p>

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
              <p className="mb-4 text-lg font-bold">{fmt(price * qty)}</p>
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
        <p className="text-2xl font-bold">Total: {fmt(total)}</p>

        <div className="flex justify-end gap-3">
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
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            {loading ? "Redirecting…" : "Checkout"}
          </Button>
        </div>
      </div>
    </main>
  );
}
