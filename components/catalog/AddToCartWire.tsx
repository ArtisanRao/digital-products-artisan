"use client";

import { useEffect } from "react";
import * as libcart from "@/lib/cart";
import { products, productsById } from "@/data/products";

type Props = { rootSelector?: string };

// Find by id or slug (case-insensitive)
function lookup(idOrSlug: string) {
  const raw = String(idOrSlug ?? "");
  const n = Number(raw);
  if (Number.isFinite(n)) {
    return (productsById as any)?.[n] || products.find((p) => Number(p.id) === n) || null;
  }
  const lc = raw.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === lc) ||
    products.find((p) => String(p.id) === raw) ||
    null
  );
}

/**
 * Delegates clicks from a product grid to add-to-cart.
 * Works with elements that have:
 *  - data-add-to-cart  (or data-cta="add-to-cart")
 *  - optional: data-product-id / data-product-slug / data-qty / data-title / data-price / data-image
 */
export default function AddToCartWire({ rootSelector = "#all-products-grid" }: Props) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const onClick = (ev: Event) => {
      let node = ev.target as HTMLElement | null;

      // bubble up until we find the add-to-cart trigger
      while (
        node &&
        node !== root &&
        !node.matches("[data-add-to-cart], [data-cta='add-to-cart']")
      ) {
        node = node.parentElement;
      }
      if (!node || node === root) return;

      ev.preventDefault();

      const productId = node.getAttribute("data-product-id");
      const slug = node.getAttribute("data-product-slug");
      const id = productId ?? slug;
      const qty = Number(node.getAttribute("data-qty") ?? 1) || 1;

      const p = id ? lookup(id) : null;
      const titleAttr = node.getAttribute("data-title");
      const priceAttr = node.getAttribute("data-price");
      const imageAttr = node.getAttribute("data-image");

      const title = titleAttr ?? p?.title ?? String(id ?? "Product");
      const price =
        priceAttr != null ? Number(priceAttr) || 0 : Number(p?.price) || 0;
      const image =
        imageAttr ??
        (Array.isArray(p?.images) ? p?.images[0] : (p as any)?.image) ??
        undefined;

      // Use unified cart helper (emits events + updates badge)
      libcart.add(String(p?.slug ?? p?.id ?? id), qty, { title, price, image });

      try {
        (navigator as any)?.vibrate?.(10);
      } catch {}
    };

    root.addEventListener("click", onClick as EventListener);
    return () => {
      root.removeEventListener("click", onClick as EventListener);
    };
  }, [rootSelector]);

  return null;
}
