"use client";

import { useEffect } from "react";

/**
 * While mounted, adds a "product-page" class to <body>
 * and sets data-page="product" so your scoped CSS applies.
 */
export default function ProductPageFlag() {
  useEffect(() => {
    const b = document.body;
    if (!b) return;

    b.classList.add("product-page");
    const prev = b.getAttribute("data-page");
    b.setAttribute("data-page", "product");

    return () => {
      b.classList.remove("product-page");
      if (prev) b.setAttribute("data-page", prev);
      else b.removeAttribute("data-page");
    };
  }, []);

  return null;
}
