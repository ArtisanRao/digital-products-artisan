// components/shop-actions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

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
  buyEnabled = true,          // <-- DEFAULT: show Buy everywhere
  buyLabel = "Buy",
  buyQty = 1,
}: Props) {
  const router = useRouter();
  const cart = (useCart?.() ?? {}) as any;

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
  };

  const view = () => {
    router.push(productHref);
  };

  const buy = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, qty: buyQty }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {/* VIEW — force blue/white */}
      <Button
        type="button"
        onClick={view}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{ backgroundColor: "#2563eb", color: "#fff" }}
        aria-label={`View ${item.title}`}
      >
        <Eye className="h-4 w-4 text-white" />
        View
      </Button>

      {/* BUY — open Stripe Checkout (now ON by default) */}
      {buyEnabled && (
        <Button
          type="button"
          onClick={buy}
          variant="default"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Buy ${item.title} now`}
        >
          {buyLabel}
        </Button>
      )}

      {/* ADD TO CART — add silently, stay put */}
      <Button
        type="button"
        onClick={add}
        variant="default"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`Add ${item.title} to cart`}
      >
        <ShoppingCart className="h-4 w-4 text-white" />
        Add to cart
      </Button>
    </div>
  );
}
