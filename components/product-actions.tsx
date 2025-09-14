"use client";

import { useState, MouseEvent } from "react";
import { ShoppingCart, Eye } from "lucide-react";

type Props = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
};

// local add-to-cart (updates header badge via `cart:updated`)
function addToCartLocal(
  item: { id: string; name: string; price: number; image?: string; quantity: number },
  opts?: { replace?: boolean }
) {
  try {
    const raw = localStorage.getItem("cart");
    const arr: Array<any> = raw ? JSON.parse(raw) : [];

    const idx = arr.findIndex((x) => String(x.id) === item.id);
    if (idx >= 0) {
      if (opts?.replace) {
        arr[idx] = { ...arr[idx], ...item };
      } else {
        arr[idx].quantity = (Number(arr[idx].quantity) || 1) + item.quantity;
      }
    } else {
      arr.push({ ...item });
    }

    localStorage.setItem("cart", JSON.stringify(arr));
    const count = arr.reduce((n, it) => n + Number(it.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items: arr } }));
    return true;
  } catch (e) {
    console.error("addToCartLocal error:", e);
    return false;
  }
}

// best-effort currency hint for the API
function getPreferredCurrency(): "eur" | "usd" {
  try {
    const raw =
      (localStorage.getItem("preferredCurrency") ||
        localStorage.getItem("currency") ||
        "eur") as string;
    const v = raw.toLowerCase();
    return (v === "usd" ? "usd" : "eur") as "eur" | "usd";
  } catch {
    return "eur";
  }
}

export default function ProductActions({
  id,
  title,
  price,
  image,
  quantity = 1,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState(false);
  const idStr = String(id);

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    addToCartLocal(
      { id: idStr, name: title, price, image, quantity: Math.max(1, Number(quantity) || 1) },
      { replace: false }
    );
    setAdding(false);
    // stay on page — header badge updates via cart:updated
  };

  const handleView = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setViewing(true);
    try {
      // create a single-item checkout session directly (no /checkout page)
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [
            {
              id: idStr,
              name: title,
              price,       // numeric amount; server uses chosen currency
              image,
              quantity: 1,
            },
          ],
          currency: getPreferredCurrency(),
        }),
      });

      const data = await resp.json();
      if (resp.ok && data?.url) {
        window.location.href = data.url as string; // ⟶ Stripe Checkout
      } else {
        console.error("Checkout error:", data);
        // (optional) show a toast here
      }
    } catch (err) {
      console.error(err);
    } finally {
      setViewing(false);
    }
  };

  return (
    <div className="relative z-10 flex items-center gap-3 pointer-events-auto">
      <button
        type="button"
        onClick={handleView}
        disabled={viewing}
        aria-label="View (go to checkout)"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500 disabled:opacity-60"
      >
        <Eye className="h-4 w-4" />
        {viewing ? "Opening…" : "View"}
      </button>

      <button
        type="button"
        onClick={handleAdd}
        disabled={adding}
        aria-label="Add to cart"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500 disabled:opacity-60"
      >
        <ShoppingCart className="h-4 w-4" />
        {adding ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}
