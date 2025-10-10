// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import ForceCurrencyFromQuery from "@/components/currency/ForceCurrencyFromQuery";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { products } from "@/data/products"; // ← adjust if your path differs

type SP = Record<string, string | string[] | undefined>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SP>;
}) {
  // Next 15 expects these as Promises in your route's generated types
  const { slug } = await params;
  const sp = (await searchParams) || {};

  const qCurrency = Array.isArray(sp.currency) ? sp.currency[0] : sp.currency;
  const currency = (qCurrency || "USD").toUpperCase() as "USD" | "EUR" | "GBP";

  // Find product by slug (adapt to your data structure)
  const product = (products as any[]).find((p) => p.slug === slug);
  if (!product) notFound();

  // Use EUR when forced via ?currency=EUR (ensure priceEUR exists in your data)
  const price =
    currency === "EUR" ? product.priceEUR ?? product.price : product.price;

  const url = `https://digitalproductsartisan.com/products/${slug}?currency=${currency}`;
  const image =
    product.image ??
    `https://digitalproductsartisan.com/images/products/${slug}/cover.jpg`;

  return (
    <>
      {/* Client helper to sync site currency with ?currency= param */}
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

      {/* --- your existing PDP UI --- */}
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-3">{product.title}</h1>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        <p className="text-xl font-bold">
          {currency} {Number(price).toFixed(2)}
        </p>
      </main>
    </>
  );
}
