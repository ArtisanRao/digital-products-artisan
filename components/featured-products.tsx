// components/featured-products.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Heart } from "lucide-react";
import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";
import DescriptionClamp from "@/components/DescriptionClamp";
import { productsBySlug, productPath, type Product } from "@/data/products";
import { formatCurrency } from "@/lib/money"; // ← centralized currency formatter

// Pick which products to feature by slug (must exist in productsBySlug)
const FEATURED_SLUGS = [
  "complete-shop-with-plr-mrr-rights",
  "the-art-of-not-giving-a-fuck",
  "digital-wealth-ultimate-guide",
  "chatgpt-side-hustles",
  "make-money-as-you-sleep",
];

type CardProps = {
  product: Product;
  index: number;
};

function ProductCard({ product, index }: CardProps) {
  const src = product.image ?? `/images/products/${product.slug}/cover.jpg`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={productPath(product)} aria-label={`View ${product.title}`} className="block">
            <CoverImage
              src={src}
              alt={product.title}
              ratio="3/2"
              fit="contain"
              hover
              paddingClass="p-2"
              roundedClass="rounded-t-lg"
              sizes="(min-width:1280px) 280px, (min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
              priority={index < 2}
            />
          </Link>

          {product.bestseller && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-600">
              Bestseller
            </Badge>
          )}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
            aria-label="Add to favorites"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{product.category}</Badge>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {product.rating.toFixed?.(1) ?? product.rating}
            </span>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
        </div>

        <Link
          href={productPath(product)}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
        >
          <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
        </Link>

        <DescriptionClamp
          text={(product.longDescription ?? product.description) as string}
          maxChars={140}
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Download className="w-4 h-4 mr-1" />
            {product.downloads}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          asChild
        >
          <Link href={productPath(product)}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function FeaturedProducts() {
  const featured = FEATURED_SLUGS
    .map((slug) => productsBySlug[slug])
    .filter(Boolean) as Product[];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best-Selling Digital Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular digital downloads that creators love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((product, i) => (
            <ProductCard key={`featured:${product.slug}`} product={product} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
