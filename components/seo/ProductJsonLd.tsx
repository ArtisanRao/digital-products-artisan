import Script from "next/script";

type Props = {
  name: string;
  description: string;
  image: string;
  url: string;           // include ?currency=EUR for DE feed links
  price: string | number;
  currency: "EUR" | "USD" | "GBP";
  brand?: string;
};

export default function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  currency,
  brand = "Digital Products Artisan",
}: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image,
    description,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      url,
      price: String(price),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <Script id="jsonld-product" type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
