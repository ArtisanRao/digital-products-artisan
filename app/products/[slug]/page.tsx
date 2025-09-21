// NOTE: Do NOT add "use client" here — route must be a Server Component
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import Image from "next/image";
import Link from "next/link";
import InlineMore from "@/components/ui/inline-more";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";
import { products, productsById } from "@/data/products";
import { getPreferredCurrency } from "@/lib/currency";

type PageProps = { params: { slug: string } };

function findProduct(idOrSlug: string) {
  const asNum = Number(idOrSlug);
  if (Number.isFinite(asNum)) {
    const byId = (productsById as any)?.[asNum];
    if (byId) return byId;
    const byIdLinear = products.find((p) => Number(p.id) === asNum);
    if (byIdLinear) return byIdLinear;
  }
  const slug = idOrSlug.toLowerCase();
  return (
    products.find((p) => String(p.slug).toLowerCase() === slug) ||
    products.find((p) => String(p.id) === idOrSlug) ||
    null
  );
}

export default function Page({ params }: PageProps) {
  const handle = String(params?.slug ?? "");
  const p = findProduct(handle);

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  const imgs: string[] = (p.images?.length ? p.images : [p.image]).filter(Boolean) as string[];
  const cover = imgs[0] ?? "/images/placeholder-cover.jpg";

  // Currency formatting on the server is fine
  const currencyRaw = getPreferredCurrency();
  const currency = String(currencyRaw).toUpperCase() as "EUR" | "USD";
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  const display = new Intl.NumberFormat(locale, { style: "currency", currency }).format(p.price);

  const canonicalHref = `/products/${encodeURIComponent(String(p.slug ?? p.id))}`;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1.2fr_.8fr]">
      {/* Simple server-rendered “gallery”: hero + thumbnails (no client state here) */}
      <section style={{ zIndex: 1, position: "relative" }}>
        <div className="grid grid-cols-[86px_1fr] gap-4 lg:gap-6 relative">
          <div className="flex max-h-[560px] flex-col gap-3 overflow-auto pr-1">
            {imgs.map((src, i) => (
              <div
                key={src + i}
                className="relative aspect-square w-[86px] overflow-hidden rounded-xl border border-gray-200"
                aria-hidden
              >
                <Image src={src} alt={`${p.title} — thumbnail ${i + 1}`} fill sizes="86px" className="object-cover" />
              </div>
            ))}
          </div>

          <div className="relative isolate rounded-2xl border bg-white">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src={cover}
                alt={p.title}
                fill
                sizes="(min-width:1024px) 720px, 100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details / Actions */}
      <section className="isolate" style={{ position: "relative", zIndex: 60, pointerEvents: "auto" }}>
        <h1
          className="text-4xl font-extrabold leading-tight"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <Link
            href={canonicalHref}
            className="underline decoration-transparent hover:decoration-current focus:decoration-current"
            style={{ pointerEvents: "auto" }}
          >
            {p.title}
          </Link>
        </h1>

        <div className="mt-4 text-3xl font-semibold">{display}</div>

        <div className="mt-4 text-gray-700">
          <InlineMore text={p.description ?? ""} lines={3} minChars={80} />
        </div>

        <div
          className="mt-6 flex flex-wrap gap-3"
          style={{ position: "relative", zIndex: 61, pointerEvents: "auto" }}
        >
          <AddToCartButton
            productId={p.id}
            className="bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          />

          {/* Simple link fallback for Buy to keep this file server-only */}
          <Button asChild className="gap-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
            <Link href="/checkout">Buy</Link>
          </Button>
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
