"use client";

import { useState, MouseEvent } from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { getPreferredCurrency } from "@/lib/currency";

type Size = "sm" | "md" | "lg";

type Props = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  quantity?: number;

  /** UI size */
  size?: Size;

  /** Extra wrapper classes */
  className?: string;

  /** When provided, “View” becomes a simple link (no checkout POST). */
  viewHref?: string;

  /**
   * Toggle the presence of the “View/Buy” button entirely.
   * Useful on category grids where slug !== numeric productId.
   * Defaults to true.
   */
  buyEnabled?: boolean;

  /**
   * After adding to cart, navigate to /cart.
   * Defaults to false (stay on the page, badge updates via event).
   */
  goToCartAfterAdd?: boolean;
};

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

const SIZE_STYLES: Record<Size, { btn: string; icon: string; gap: string }> = {
  sm: { btn: "px-3 py-1.5 text-sm", icon: "h-4 w-4", gap: "gap-2" },
  md: { btn: "px-4 py-2 text-sm", icon: "h-4 w-4", gap: "gap-3" },
  lg: { btn: "px-5 py-2.5 text-base", icon: "h-5 w-5", gap: "gap-3" },
};

export default function ProductActions({
  id,
  title,
  price,
  image,
  quantity = 1,
  size = "md",
  className,
  viewHref,
  buyEnabled = true,
  goToCartAfterAdd = false,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState(false);
  const idStr = String(id);
  const s = SIZE_STYLES[size];

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    addToCartLocal(
      { id: idStr, name: title, price, image, quantity: Math.max(1, Number(quantity) || 1) },
      { replace: false }
    );
    setAdding(false);

    if (goToCartAfterAdd) {
      window.location.href = "/cart";
    }
  };

  const handleViewCheckout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setViewing(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ id: idStr, name: title, price, image, quantity: 1 }],
          currency: getPreferredCurrency(),
        }),
      });
      const data = await resp.json();
      if (resp.ok && data?.url) {
        window.location.href = data.url as string; // → Stripe Checkout
      } else {
        console.error("Checkout error:", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setViewing(false);
    }
  };

  return (
    <div className={`relative z-10 flex items-center ${s.gap} pointer-events-auto ${className ?? ""}`}>
      {/* View / Buy */}
      {buyEnabled && (
        viewHref ? (
          <Link
            href={viewHref}
            aria-label="View product"
            className={`inline-flex items-center ${s.gap} rounded-lg bg-blue-600 ${s.btn} text-white
                        hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-500`}
          >
            <Eye className={s.icon} />
            View
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleViewCheckout}
            disabled={viewing}
            aria-label="Buy (go to checkout)"
            className={`inline-flex items-center ${s.gap} rounded-lg bg-blue-600 ${s.btn} text-white
                        hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-500 disabled:opacity-60`}
          >
            <Eye className={s.icon} />
            {viewing ? "Opening…" : "Buy"}
          </button>
        )
      )}

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={adding}
        aria-label="Add to cart"
        className={`inline-flex items-center ${s.gap} rounded-lg bg-blue-600 ${s.btn} text-white
                    hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-blue-500 disabled:opacity-60`}
      >
        <ShoppingCart className={s.icon} />
        {adding ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}
