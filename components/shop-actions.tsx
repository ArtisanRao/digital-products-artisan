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
  /** Where the blue “View” should go. Default: /products/:id */
  viewHref?: string;
  /** After adding, optionally go to /cart so the badge is visible. Default: false (stay put) */
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
  buyEnabled = true, // default: show Buy
  buyLabel = "Buy",
  buyQty = 1,
}: Props) {
  const router = useRouter();
  const cart = (useCart?.() ?? {}) as any;

  const [busyAdd, setBusyAdd] = React.useState(false);
  const [busyBuy, setBusyBuy] = React.useState(false);
  const [busyView, setBusyView] = React.useState(false);

  const productHref =
    viewHref ?? `/products/${encodeURIComponent(String(item.id))}`;

  // ——— helpers ———
  const stopAll = (e?: any) => {
    try {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      // In case parent has native event listeners (e.g., on the card wrapper)
      e?.nativeEvent?.stopImmediatePropagation?.();
    } catch {}
  };

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

  // ——— actions ———
  const add = async (e?: any) => {
    stopAll(e);
    if (busyAdd) return;
    setBusyAdd(true);
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
    } catch (err) {
      // optional toast/log
      // console.error("add-to-cart failed:", err);
    } finally {
      setBusyAdd(false);
    }
  };

  const view = (e?: any) => {
    stopAll(e);
    if (busyView) return;
    setBusyView(true);
    try {
      router.push(productHref);
    } finally {
      // router.push is sync here; release state immediately to avoid stuck button
      setBusyView(false);
    }
  };

  const buy = async (e?: any) => {
    stopAll(e);
    if (busyBuy) return;
    setBusyBuy(true);
    try {
      const currency = getPreferredCurrency(); // "eur" enables Klarna downstream if eligible
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, qty: buyQty, currency }),
      });
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok || !data?.url) {
        // optional toast
        // console.error("Checkout failed:", text);
        return;
      }
      window.location.href = data.url as string;
    } catch (err) {
      // optional toast/log
      // console.error("buy-now failed:", err);
    } finally {
      setBusyBuy(false);
    }
  };

  return (
    <div
      className="mt-3 flex flex-wrap items-center gap-2 relative z-30 pointer-events-auto"
      onClickCapture={stopAll} // hard stop parent Link/Card from hijacking
    >
      {/* VIEW — force blue/white; fully clickable even inside links/cards */}
      <Button
        type="button"
        onClick={view}
        disabled={busyView}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 relative z-30 pointer-events-auto"
        style={{ backgroundColor: "#2563eb", color: "#fff" }}
        aria-label={`View ${item.title}`}
        title={`View ${item.title}`}
      >
        <Eye className="h-4 w-4 text-white" />
        {busyView ? "Opening…" : "View"}
      </Button>

      {/* BUY — Stripe Checkout */}
      {buyEnabled && (
        <Button
          type="button"
          onClick={buy}
          disabled={busyBuy}
          variant="default"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 relative z-30 pointer-events-auto"
          aria-label={`Buy ${item.title} now`}
          title={`Buy ${item.title} now`}
        >
          {busyBuy ? "Redirecting…" : buyLabel}
        </Button>
      )}

      {/* ADD TO CART — add silently, stay put */}
      <Button
        type="button"
        onClick={add}
        disabled={busyAdd}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 relative z-30 pointer-events-auto"
        aria-label={`Add ${item.title} to cart`}
        title={`Add ${item.title} to cart`}
      >
        <ShoppingCart className="h-4 w-4 text-white" />
        {busyAdd ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
