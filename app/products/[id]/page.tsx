"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import ShopActions from "@/components/shop-actions";

const PRODUCTS: Record<
  string,
  { title: string; price: number; images: string[]; description: string }
> = {
  "1": {
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Ebooks, Courses, Prompts & More.",
    price: 42.99,
    images: [
      "/images/complete-shop-1.jpg",
      "/images/complete-shop-2.jpg",
      "/images/complete-shop-3.jpg",
      "/images/complete-shop-4.jpg",
      "/images/complete-shop-5.jpg",
    ],
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell ebooks, courses, prompts, templates, and more.",
  },
};

function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = images?.length ? images : ["/images/placeholder-cover.jpg"];
  const [idx, setIdx] = React.useState(0);
  const n = safe.length;
  const go = (d: number) => setIdx((i) => (i + d + n) % n);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  return (
    <div className="grid grid-cols-[86px_1fr] gap-4 lg:gap-6" style={{ position: "relative", zIndex: 1 }}>
      <div className="flex max-h-[560px] flex-col gap-3 overflow-auto pr-1">
        {safe.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onMouseEnter={() => setIdx(i)}
            onClick={() => setIdx(i)}
            className={[
              "relative aspect-square w-[86px] overflow-hidden rounded-xl border transition",
              i === idx ? "ring-2 ring-blue-500 border-transparent" : "border-gray-200 hover:border-blue-300",
            ].join(" ")}
            aria-label={`Preview image ${i + 1}`}
          >
            <Image src={src} alt={`${alt} — preview ${i + 1}`} fill sizes="86px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative isolate rounded-2xl border bg-white">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            key={safe[idx]}
            src={safe[idx]}
            alt={alt}
            fill
            priority={idx === 0}
            sizes="(min-width:1024px) 720px, 100vw"
            className="object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? "");
  const p = PRODUCTS[id];

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const handleBuy = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, qty: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } catch {}
  };

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      <section style={{ position: "relative", zIndex: 1 }}>
        <ProductGallery images={p.images} alt={p.title} />
      </section>

      <section
        className="isolate"
        style={{ position: "relative", zIndex: 60, pointerEvents: "auto" }}
      >
        <h1
          className="text-4xl font-extrabold leading-tight"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Link
            href={`/products/${id}`}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(p.price)}
        </div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description} lines={3} minChars={80} />
        </div>

        <div
          className="mt-6 flex flex-wrap gap-3"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Button
            type="button"
            onClick={handleBuy}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ pointerEvents: "auto" }}
          >
            Buy
          </Button>

          <ShopActions
            item={{
              id,
              title: p.title,
              price: p.price,
              image: p.images[0],
              description: p.description,
            }}
            viewHref={`/products/${id}`}
            goToCartAfterAdd={false}
            buyEnabled={false}
          />
        </div>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>Instant download after purchase</li>
          <li>PLR / MRR license included (where stated)</li>
          <li>Secure checkout via Stripe</li>
        </ul>
      </section>
    </main>
  );
}
