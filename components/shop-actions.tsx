"use client";

import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

type Item = {
  id: string;
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
};

export default function ShopActions({
  item,
  viewHref,
  goToCartAfterAdd = false,
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
        url: productHref, // stable product URL
        quantity: 1,
      });
    }
    persistAndBroadcast(items);
  };

  const add = () => {
    // best-effort: support any cart context shape WITHOUT redirecting/opening
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

    // Stay put by default; only navigate if explicitly enabled
    if (goToCartAfterAdd) router.push("/cart");
  };

  const view = () => {
    router.push(productHref);
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      {/* VIEW — go to product page (no login) */}
      <Button
        type="button"
        onClick={view}
        className="gap-2 bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`View ${item.title}`}
      >
        <Eye className="h-4 w-4" />
        View
      </Button>

      {/* ADD TO CART — add silently, stay put (no checkout redirect) */}
      <Button
        type="button"
        onClick={add}
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`Add ${item.title} to cart`}
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}
