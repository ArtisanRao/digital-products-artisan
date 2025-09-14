// components/commerce/AddToCart.tsx
"use client";

import * as React from "react";

type Props = {
  id: string | number;
  name: string;
  price: number;
  url: string;          // e.g. `/categories/ebooks` (the page url)
  description?: string;
  image?: string;       // full or relative path
  fileUrl?: string;     // your downloadable file path if you use digital delivery
  className?: string;
};

export default function AddToCart({
  id, name, price, url, description = "", image = "", fileUrl = "", className = ""
}: Props) {
  // If Snipcart isn't present for any reason, go to /checkout with the item info.
  const fallback = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // If Snipcart is available, let it handle the click.
    if (typeof window !== "undefined" && (window as any).Snipcart) return;

    const params = new URLSearchParams({
      id: String(id),
      name,
      price: String(price),
      url,
      description,
      image,
      fileUrl
    });
    window.location.href = `/checkout?${params.toString()}`;
  }, [id, name, price, url, description, image, fileUrl]);

  return (
    <button
      type="button"
      onClick={fallback}
      className={`snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition ${className}`}
      data-item-id={id}
      data-item-name={name}
      data-item-price={price}
      data-item-url={url}
      data-item-description={description}
      data-item-image={image}
      data-item-file-guid={fileUrl}
    >
      Add to Cart
    </button>
  );
}
