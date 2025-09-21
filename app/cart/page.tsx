"use client";

import { useState, useEffect, useMemo } from "react";
import { getPreferredCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string;        // product.id as string
  name: string;
  price: number;     // in the currently-selected currency
  quantity: number;
  image?: string;
  url?: string;
  description?: string;
  fileGuid?: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false); // â¬…ï¸ avoid flash-of-empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("eur");

  // Bootstrap currency + react to header picker
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

  // Helper to persist + broadcast (keeps header badge in sync)
  const persistAndBroadcast = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
    } catch {
      /* no-op */
    }
  };

  // Load cart from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
      setCartItems(items);
      persistAndBroadcast(items); // ensure header badge matches
    } catch {
      /* ignore parse errors */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Stay in sync if other parts of the app update the cart
  useEffect(() => {
    const onCartUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ items?: CartItem[] }>).detail;
      if (detail?.items) {
        setCartItems(detail.items);
      } else {
        try {
          const raw = localStorage.getItem("cart");
          setCartItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
        } catch {}
      }
    };
    window.addEventListener("cart:updated", onCartUpdated as EventListener);
    return () => window.removeEventListener("cart:updated", onCartUpdated as EventListener);
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    persistAndBroadcast(items);
    setError(null);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCart(cartItems.map((it) => (it.id === id ? { ...it, quantity } : it)));
  };

  const handleRemove = (id: string) => updateCart(cartItems.filter((it) => it.id !== id));
  const handleClear = () => updateCart([]);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cartItems]
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
      // Fallback if a weird/unsupported currency code slips through
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }).format(n);
    }
  };

  // Stripe Checkout (multi-item) via /api/checkout â€” send the "lines" shape
  const handleCheckout = async () => {
    if (!cartItems.length) {
      setError("Your cart is empty!");
      return;
    }

    const lines = cartItems.map((ci) => ({
      id: ci.id,
      name: ci.name,
      price: ci.price,
      image: ci.image,
      quantity: Math.max(1, Number(ci.quantity) || 1),
    }));

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, currency }), // currency is optional server-side
      });

      const data = await resp.json();
      if (!resp.ok || !data?.url) {
        console.error("Checkout error:", data);
        setError(data?.error || "Sorryâ€”couldnâ€™t start checkout.");
        setLoading(false);
        return;
      }

      window.location.href = data.url as string; // âŸ¶ Stripe Checkout
    } catch (e) {
      console.error(e);
      setError("Network error starting checkout.");
      setLoading(false);
    }
  };

  // While hydrating, avoid showing "empty" state flash
  if (!hydrated) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Loading cartâ€¦</h1>
        <p className="text-gray-600">Please wait.</p>
      </main>
    );
  }

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
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700" aria-live="polite">
          {error}
        </div>
      )}

      <ul className="mb-8 divide-y divide-gray-200">
        {cartItems.map(({ id, name, price, quantity, image }) => (
          <li key={id} className="flex items-center py-6">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="mr-6 h-24 w-24 rounded object-cover"
                loading="lazy"
              />
            ) : null}

            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="mt-1 text-gray-700">{formatMoney(price)} each</p>

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
                  className="w-16 rounded border p-1 text-center"
                />
              </div>
            </div>

            <div className="ml-6 flex flex-col items-end">
              <p className="mb-4 text-lg font-bold">{formatMoney(price * quantity)}</p>
              <button
                onClick={() => handleRemove(id)}
                className="font-semibold text-red-600 hover:text-red-800"
                aria-label={`Remove ${name} from cart`}
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
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            {loading ? "Redirectingâ€¦" : "Checkout"}
          </Button>
        </div>
      </div>
    </main>
  );
}
