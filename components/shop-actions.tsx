// components/shop-actions.tsx
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
  /** Show a Buy button that opens Stripe Checkout */
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

  // UI safety: prevent double clicks
  const [adding, setAdding] = React.useState(false);
  const [buying, setBuying] = React.useState(false);
  const [navigating, setNavigating] = React.useState(false);

  const productHref = viewHref ?? `/products/${encodeURIComponent(String(item.id))}`;

  const stop = (e: React.MouseEvent) => {
    // Make sure parent clickable layers never swallow these
    e.preventDefault();
    e.stopPropagation();
  };

  const persistAndBroadcast = (items: any[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
      const count = items.reduce((n, i) => n + Number(i.quantity || 1), 0);
      localStorage.setItem("cartCount", String(count));
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count, items } }));
      window.dispatchEvent(new CustomEvent("cart:item-added", { detail: { item, count } }));
    } catch {
      /* no-op */
    }
  };

  const addToLocalCart = () => {
    if (typeof window === "undefined") return;
    let items: any[] = [];
    try {
      items = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      items = [];
    }
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

  const add = async (e: React.MouseEvent) => {
    stop(e);
    if (adding) return;
    setAdding(true);
    try {
      // Best-effort: support any cart context shape WITHOUT redirecting/opening
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
      setAdding(false);
    }
  };

  const view = async (e: React.MouseEvent) => {
    stop(e);
    if (navigating) return;
    setNavigating(true);
    try {
      router.push(productHref);
    } finally {
      // Small delay prevents rapid double-activations if overlays exist
      setTimeout(() => setNavigating(false), 150);
    }
  };

  const buy = async (e: React.MouseEvent) => {
    stop(e);
    if (buying) return;
    setBuying(true);
    try {
      const currency = getPreferredCurrency?.() ?? "usd";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, qty: buyQty, currency }),
      });

      // Handle non-JSON or error responses gracefully
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
      if (!res.ok || !data?.url) {
        // Don’t throw UI errors at users; just fail silently (or wire a toast here)
        return;
      }
      window.location.href = data.url as string;
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 isolate z-20 pointer-events-auto">
      {/* VIEW — go to product details page; forced blue/white */}
      <Button
        type="button"
        onClick={view}
        disabled={navigating}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{ backgroundColor: "#2563eb", color: "#fff" }}
        aria-label={`View ${item.title}`}
        data-role="view-button"
      >
        <Eye className="h-4 w-4 text-white" />
        {navigating ? "Opening…" : "View"}
      </Button>

      {/* BUY — open Stripe Checkout */}
      {buyEnabled && (
        <Button
          type="button"
          onClick={buy}
          disabled={buying}
          variant="default"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Buy ${item.title} now`}
          data-role="buy-button"
        >
          {buying ? "Redirecting…" : buyLabel}
        </Button>
      )}

      {/* ADD TO CART — add silently, stay put (badge updates via events) */}
      <Button
        type="button"
        onClick={add}
        disabled={adding}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`Add ${item.title} to cart`}
        data-role="add-to-cart-button"
      >
        <ShoppingCart className="h-4 w-4 text-white" />
        {adding ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
