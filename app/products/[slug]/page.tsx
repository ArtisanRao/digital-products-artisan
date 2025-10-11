// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import ForceCurrencyFromQuery from "@/components/currency/ForceCurrencyFromQuery";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import SubcategoryNav from "@/components/products/SubcategoryNav";
import { products } from "@/data/products";

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

  // Preserve ALL incoming query params (e.g., currency=EUR)
  const spEntries = Object.entries(sp).filter(([_, v]) => v != null && v !== "");
  const qs =
    spEntries.length > 0
      ? `?${new URLSearchParams(
          spEntries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : (v as string)])
        ).toString()}`
      : "";

  // Currency (still read for price selection)
  const qCurrency = Array.isArray(sp.currency) ? sp.currency[0] : sp.currency;
  const currency = (qCurrency || "USD").toUpperCase() as "USD" | "EUR" | "GBP";

  // Find product by slug
  const product = (products as any[]).find((p) => p.slug === slug);
  if (!product) notFound();

  // Price map (ensure product.priceEUR exists if using EUR)
  const price = currency === "EUR" ? product.priceEUR ?? product.price : product.price;

  // URL-safe paths
  const safeSlug = encodeURIComponent(slug);
  const url = `https://digitalproductsartisan.com/products/${safeSlug}${qs}`;
  const image =
    product.image ?? `https://digitalproductsartisan.com/images/products/${safeSlug}/cover.jpg`;

  // ✅ Canonical subcategory items (new slugs)
  const subcategories = [
    { label: "All", href: "/categories" },
    { label: "AI & ChatGPT", slug: "ai-and-chatgpt-guides" },
    { label: "Planners", slug: "planners-and-productivity" },
    { label: "Self-Help", slug: "self-help-and-how-to" },
    { label: "PLR & MRR", slug: "plr-and-mrr-bundles" },
  ];

  return (
    <>
      {/* Sync site currency with ?currency= param (client helper) */}
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

      <main
        className="container mx-auto px-4 py-8 product-page"
        data-page="product"
        style={{ pointerEvents: "auto", isolation: "isolate" }}
      >
        {/* ✅ Clickable client nav; sits above any overlays */}
        <div
          id="subcat-nav"
          className="relative z-[1000] mb-6 clickable-surface"
          style={{ pointerEvents: "auto", isolation: "isolate" }}
        >
          {/* Ensure no ancestor disables pointer events */}
          {typeof window !== "undefined" && (
            <style suppressHydrationWarning>{`
              #subcat-nav, #subcat-nav * { pointer-events: auto !important; }
            `}</style>
          )}

          <SubcategoryNav
            items={subcategories}
            basePath="/categories"
            className="border-b pb-3"
          />
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
