import ProductJsonLd from "@/components/seo/ProductJsonLd";
import ForceCurrencyFromQuery from "@/components/currency/ForceCurrencyFromQuery";

export default function Page() {
  const priceEUR = 13.99; // <- match your DE feed price exactly

  const urlEUR = "https://digitalproductsartisan.com/products/the-art-of-giving-no-fcks?currency=EUR";
  const image = "https://digitalproductsartisan.com/images/products/the-art-of-giving-no-fcks/cover.jpg";

  return (
    <>
      <ForceCurrencyFromQuery />
      <ProductJsonLd
        name="The Art of Giving No F*cks — Self-Help eBook (Digital Download)"
        description="Bold, practical guide to emotional freedom, boundaries and focus."
        image={image}
        url={urlEUR}
        price={priceEUR}
        currency="EUR"
      />
      {/* ...your existing PDP UI... */}
    </>
  );
}
