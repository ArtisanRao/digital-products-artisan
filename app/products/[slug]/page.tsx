// ✅ Server Component page with correct types
import { notFound } from "next/navigation";
import ForceCurrencyFromQuery from "@/components/currency/ForceCurrencyFromQuery";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
// If you have central product data, import it here
import { products } from "@/data/products"; // adjust if your path differs

type PageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Page({ params, searchParams }: PageProps) {
  const { slug } = params;

  // Find the product (adjust to your data shape)
  const product = (products as any[]).find((p) => p.slug === slug);
  if (!product) notFound();

  // Read ?currency= from URL so Merchant Center sees EUR when we append it
  const qCurrency = Array.isArray(searchParams?.currency)
    ? searchParams!.currency[0]
    : searchParams?.currency;

  const currency = (qCurrency || "USD").toUpperCase() as "USD" | "EUR" | "GBP";

  // Map the price we want to expose (for DE feed we use EUR)
  const price =
    currency === "EUR"
      ? product.priceEUR ?? product.price // <- add product.priceEUR in your data if you have it
      : product.price;

  const productUrl = `https://digitalproductsartisan.com/products/${slug}${
    currency ? `?currency=${currency}` : ""
  }`;

  const image =
    product.image ??
    `https://digitalproductsartisan.com/images/products/${slug}/cover.jpg`;

  return (
    <>
      {/* small client helper that reads ?currency=EUR and sets the site currency */}
      <ForceCurrencyFromQuery />

      {/* JSON-LD MUST match page price & currency */}
      <ProductJsonLd
        name={product.title}
        description={product.description}
        image={image}
        url={productUrl}
        price={price}
        currency={currency as "USD" | "EUR" | "GBP"}
      />

      {/* --- Your existing PDP UI goes here --- */}
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-3">{product.title}</h1>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        <p className="text-xl font-bold">
          {currency} {Number(price).toFixed(2)}
        </p>
        {/* render gallery, buy buttons, etc. */}
      </main>
    </>
  );
}
