// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import ForceCurrencyFromQuery from "@/components/currency/ForceCurrencyFromQuery";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { products } from "@/data/products"; // adjust if needed

type SP = Record<string, string | string[] | undefined>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SP>;
}) {
  // Next 15: params/searchParams are Promises
  const { slug } = await params;
  const sp = (await searchParams) || {};

  const qCurrency = Array.isArray(sp.currency) ? sp.currency[0] : sp.currency;
  const currency = (qCurrency || "USD").toUpperCase() as "USD" | "EUR" | "GBP";
  const qs = currency ? `?currency=${currency}` : "";

  // Find product
  const product = (products as any[]).find((p) => p.slug === slug);
  if (!product) notFound();

  // Map price (ensure product.priceEUR exists if using EUR)
  const price =
    currency === "EUR" ? product.priceEUR ?? product.price : product.price;

  const url = `https://digitalproductsartisan.com/products/${slug}${qs}`;
  const image =
    product.image ??
    `https://digitalproductsartisan.com/images/products/${slug}/cover.jpg`;

  // Subcategory links (adjust slugs/labels to your taxonomy)
  const subcategories: Array<{ label: string; href: string }> = [
    { label: "All", href: `/products${qs}` },
    { label: "AI & ChatGPT", href: `/categories/ai-and-chatgpt-guides${qs}` },
    { label: "Planners", href: `/categories/planners-productivity${qs}` },
    { label: "Self-Help", href: `/categories/self-help-and-how-to${qs}` },
    { label: "PLR & MRR", href: `/categories/plr-mrr-bundles${qs}` },
  ];

  return (
    <>
      {/* Sync site currency with ?currency= param */}
      <ForceCurrencyFromQuery />

      {/* JSON-LD MUST match page price & currency */}
      <ProductJsonLd
        name={product.title}
        description={product.description}
        image={image}
        url={url}
        price={Number(price)}
        currency={currency}
      />

      <main className="container mx-auto px-4 py-8">
        {/* ✅ Clickable subcategory bar (server-rendered Links, no client code needed) */}
        <div
          className="relative z-50 mb-6"
          style={{ pointerEvents: "auto", isolation: "isolate" }}
        >
          {/* If you have any decorative overlays, make sure they DO NOT capture clicks */}
          {/* Example overlay pattern (keep pointer-events-none on decorative layers):
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden />
          */}
          <nav className="flex flex-wrap gap-2 border-b pb-3">
            {subcategories.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-3 py-1 rounded-full border text-sm hover:bg-muted transition"
                style={{ pointerEvents: "auto" }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- PDP content --- */}
        <h1 className="text-3xl font-semibold mb-3">{product.title}</h1>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        <p className="text-xl font-bold">
          {currency} {Number(price).toFixed(2)}
        </p>
        {/* gallery, buy buttons, etc. */}
      </main>
    </>
  );
}
