"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { getPreferredCurrency } from "@/lib/currency";

type Item = {
  id: string | number;
  title: string;
  price: number;
  image: string;
  description?: string;
  fileUrl?: string;
};

type Props = {
  item: Item;
  /** Where “View” should go. Default: /products/:id */
  viewHref?: string;
  /** Stay put by default; only go to /cart if true */
  goToCartAfterAdd?: boolean;
  /** OPTIONAL: show/hide Buy button (some pages render their own Buy) */
  buyEnabled?: boolean;
  buyLabel?: string;
  buyQty?: number;
};

export default function ShopActions({
  item,
  viewHref,
  goToCartAfterAdd = false,
  buyEnabled = true,
  buyLabel = "Buy",
  buyQty = 1,
}: Props) {
  const router = useRouter();
  const cart = (useCart?.() ?? {}) as any;
  const [buyLoading, setBuyLoading] = React.useState(false);
  const [addLoading, setAddLoading] = React.useState(false);

  const productHref =
    viewHref ?? `/products/${encodeURIComponent(String(item.id))}`;

  const persistAndBroadcast = (items: any[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(items));
    const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
    localStorage.setItem("cartCount", String(count));
    try {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
      window.dispatchEvent(new CustomEvent("cart:item-added", { detail: { item, count } }));
    } catch {}
  };

  const addToLocalCart = () => {
    if (typeof window === "undefined") return;
    let items: any[] = [];
    try {
      items = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}

    const idx = items.findIndex((x) => String(x.id) === String(item.id));
    if (idx >= 0) {
      items[idx].quantity = Number(items[idx].quantity || 1) + 1;
    } else {
      items.push({
        id: String(item.id),
        name: item.title,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        fileGuid: item.fileUrl,
        url: productHref,
        quantity: 1,
      });
    }
    persistAndBroadcast(items);
  };

  const add = () => {
    if (addLoading) return;
    setAddLoading(true);
    try {
      (cart.addItem ?? cart.add ?? cart.actions?.addItem)?.({
        id: String(item.id),
        name: item.title,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        fileUrl: item.fileUrl,
        url: productHref,
        quantity: 1,
      });

      addToLocalCart();
      if (goToCartAfterAdd) router.push("/cart");
    } finally {
      setAddLoading(false);
    }
  };

  const view = () => router.push(productHref);

  const buy = async () => {
    if (buyLoading) return;
    setBuyLoading(true);
    try {
      // Make sure productId is numeric for the API route
      const productId = Number(item.id);
      if (!Number.isFinite(productId)) {
        throw new Error("Invalid product id for checkout.");
      }

      const currency = String(getPreferredCurrency?.() ?? "USD").toUpperCase();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: buyQty, currency }),
      });

      const raw = await res.text();
      let data: any = {};
      try { data = JSON.parse(raw); } catch {}

      if (!res.ok || !data?.url) {
        const message = data?.error || raw || `Checkout failed (HTTP ${res.status})`;
        throw new Error(message);
      }

      window.location.href = data.url; // → Stripe Checkout
    } catch (e: any) {
      console.error("Buy error:", e);
      alert(e?.message || "Sorry—couldn't start checkout.");
    } finally {
      setBuyLoading(false);
    }
  };

  const btnClass =
    "gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 isolate z-20 pointer-events-auto">
      {/* VIEW — blue/white, always clickable */}
      <Button
        type="button"
        onClick={view}
        variant="default"
        className={btnClass}
        aria-label={`View ${item.title}`}
      >
        <Eye className="h-4 w-4 text-white" />
        View
      </Button>

      {/* BUY — open Stripe Checkout (optional) */}
      {buyEnabled && (
        <Button
          type="button"
          onClick={buy}
          disabled={buyLoading}
          variant="default"
          className={btnClass}
          aria-label={`Buy ${item.title} now`}
        >
          {buyLoading ? "Redirecting…" : buyLabel}
        </Button>
      )}

      {/* ADD TO CART — add silently, stay put */}
      <Button
        type="button"
        onClick={add}
        disabled={addLoading}
        variant="default"
        className={btnClass}
        aria-label={`Add ${item.title} to cart`}
      >
        <ShoppingCart className="h-4 w-4 text-white" />
        {addLoading ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
