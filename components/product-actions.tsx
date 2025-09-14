"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye } from "lucide-react";

type Props = {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
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
        arr[idx].quantity = item.quantity;
        arr[idx].name = item.name;
        arr[idx].price = item.price;
        arr[idx].image = item.image;
      } else {
        arr[idx].quantity = (Number(arr[idx].quantity) || 1) + item.quantity;
      }
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
  const router = useRouter();

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    // keep parent Links from hijacking the click
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    const ok = addToCartLocal(
      { id: idStr, name: title, price, image, quantity: Math.max(1, Number(quantity) || 1) },
      { replace: false }
    );
    setAdding(false);
    if (ok) window.location.href = "/cart";
  };

  const handleView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure it exists in cart (replace quantity with 1 so checkout is deterministic)
    addToCartLocal(
      { id: idStr, name: title, price, image, quantity: 1 },
      { replace: true }
    );

    router.push(`/checkout?buyNow=1&item=${encodeURIComponent(idStr)}`);
  };

  return (
    <div className="relative z-10 flex items-center gap-3 pointer-events-auto">
      <button
        type="button"
        onClick={handleView}
        aria-label="View (go to checkout)"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500"
      >
        <Eye className="h-4 w-4" />
        View
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
