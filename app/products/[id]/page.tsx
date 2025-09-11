import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Download } from "lucide-react";
import ProductGallery from "@/components/product-gallery";
import BuyNowButton from "@/components/buy-now-button";

export const dynamic = "force-dynamic";  // do not pre-render
export const revalidate = 0;             // no ISR

type Params = { id: string };

// keep metadata generation (cheap & safe)
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const p = products.find((x) => x.id === Number(id));
  if (!p) return { title: "Product not found" };

  const firstImage = p.images?.[0] ?? p.image;

  return {
    title: `${p.title} | Digital Products Artisan`,
    description: p.description,
    openGraph: { images: [{ url: firstImage }] },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [firstImage],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) return notFound();

  const galleryImages = product.images?.length ? product.images : [product.image];

  // ----- JSON-LD (SEO) -----
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const imagesAbs = galleryImages.map((i) => (i.startsWith("http") ? i : `${siteUrl}${i}`));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: imagesAbs,
    sku: product.slug,
    url: `${siteUrl}/products/${product.id}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${product.id}`,
    },
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:underline">← Back to all products</Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <ProductGallery images={galleryImages} alt={product.title} />
          </CardContent>
        </Card>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-gray-600">{product.description}</p>

          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{product.rating}</span>
            <span>({product.reviews} reviews)</span>
            <span>•</span>
            <span>{product.downloads} downloads</span>
          </div>

          <div className="mt-6 flex items-center space-x-3">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Stripe only (PayPal via Stripe if enabled there) */}
          <div className="mt-6 flex gap-3">
            <BuyNowButton productId={product.id} />
            <Button variant="outline" asChild>
              <Link href={`/checkout?product=${product.id}`}>
                <Download className="w-4 h-4 mr-2" />
                Download after purchase
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
