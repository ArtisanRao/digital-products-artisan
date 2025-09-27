"use client";

import { useEffect } from "react";
import * as cart from "@/lib/cart";

export default function AddToCartWire({
  rootSelector = "#products-catalog-root",
}: { rootSelector?: string }) {
  useEffect(() => {
    const root = document.querySelector(rootSelector) ?? document.body;

    const onClick = (ev: MouseEvent) => {
      const target = (ev.target as HTMLElement)?.closest<HTMLElement>("[data-add-to-cart]");
      if (!target) return;

      ev.preventDefault();
      ev.stopPropagation();

      const id = target.getAttribute("data-id") ?? "";
      const slug = target.getAttribute("data-slug") ?? "";
      const title = target.getAttribute("data-title") ?? (slug || id);
      const price = Number(target.getAttribute("data-price") ?? "0") || 0;
      const image = target.getAttribute("data-image") || undefined;

      const key = slug || id;
      if (!key) return;

      cart.add(key, 1, { title, price, image });
      try { navigator?.vibrate?.(10); } catch {}
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [rootSelector]);

  return null;
}
