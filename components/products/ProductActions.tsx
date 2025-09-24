"use client";

import { addToCart } from "@/lib/cart";

function parsePrice(p?: number | string): number {
  if (typeof p === "number") return p;
  const s = String(p ?? "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

async function buyNow(opts: { slugOrId?: string; priceId?: string; buyUrl?: string }) {
  if (opts.buyUrl) {
    window.location.href = opts.buyUrl;
    return;
  }
  try {
    const payload = opts.priceId
      ? { line_items: [{ price: opts.priceId, quantity: 1 }], mode: "payment" }
      : { items: [{ slug: opts.slugOrId ?? "", quantity: 1 }], mode: "payment" };

    const res = await fetch("/api/stripe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
      return;
    }
  } catch {}
  window.location.href = opts.slugOrId ? `/checkout?item=${encodeURIComponent(opts.slugOrId)}` : "/checkout";
}

export default function ProductActions(props: {
  slugOrId?: string;
  title: string;
  price?: number | string;
  image?: string;
  priceId?: string;
  buyUrl?: string;
}) {
  const { slugOrId, title, price, image, priceId, buyUrl } = props;

  const onAdd = () => {
    const numeric = parsePrice(price);
    const id = slugOrId ?? `item-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    addToCart({ id, title, price: numeric, image }, 1);
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={onAdd}
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        🛒 Add to cart
      </button>
      <button
        onClick={() => buyNow({ slugOrId, priceId, buyUrl })}
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        ⚡ Buy
      </button>
    </div>
  );
}
