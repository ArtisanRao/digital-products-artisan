"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";

type Props = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  quantity?: number; // default 1
};

function addToCartLocal(item: {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}) {
  try {
    const raw = localStorage.getItem("cart");
    const arr: Array<any> = raw ? JSON.parse(raw) : [];

    // merge by string id
    const idx = arr.findIndex((x) => String(x.id) === item.id);
    if (idx >= 0) {
      arr[idx].quantity = (Number(arr[idx].quantity) || 1) + item.quantity;
    } else {
      arr.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      });
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

export default function ProductActions({
  id,
  title,
  price,
  image,
  quantity = 1,
}: Props) {
  const [adding, setAdding] = useState(false);
  const idStr = String(id);

  const onAdd = async () => {
    setAdding(true);
    const ok = addToCartLocal({
      id: idStr,
      name: title,
      price,
      image,
      quantity: Math.max(1, Number(quantity) || 1),
    });
    setAdding(false);
    if (ok) {
      // Go to cart so the user sees items + badge in sync
      window.location.href = "/cart";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onAdd}
        disabled={adding}
        aria-label="Add to cart"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                   disabled:opacity-60"
      >
        <ShoppingCart className="h-4 w-4" />
        {adding ? "Adding…" : "Add to cart"}
      </button>

      <Link
        href="/checkout"
        aria-label="View (go to checkout)"
        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2
                   text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500"
      >
        {/* Icon explicitly blue as requested */}
        <Eye className="h-4 w-4 text-blue-600" />
        View
      </Link>
    </div>
  );
}
