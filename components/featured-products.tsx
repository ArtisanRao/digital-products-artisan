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

type FeaturedProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription?: string; // â¬…ï¸ allow richer copy if you add it later
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  downloads: number;
  category: string;
  bestseller?: boolean;
  image?: string; // can override the computed cover path
};

const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    slug: "buy-this-complete-shop",
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Ebooks, Courses, Prompts & More.",
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell ebooks, courses, prompts, templates, and more.",
    price: 42.99,
    originalPrice: 0,
    rating: 4.8,
    reviews: 210,
    downloads: 1500,
    category: "Complete Shop Packages",
    bestseller: true,
  },
  {
    id: 2,
    slug: "the-art-of-giving-no-fucks",
    title:
      "Self-Help Ebook: The Art of Giving No F*cks - Minimalist Mindset (Digital Download).",
    description:
      "A practical guide to focus, freedom, and owning your lifeâ€”minimalist mindset strategies with worksheets.",
    price: 14.99,
    originalPrice: 0,
    rating: 4.7,
    reviews: 112,
    downloads: 980,
    category: "Self-Help & How-To",
    bestseller: true,
  },
  {
    id: 3,
    slug: "digital-wealth-ultimate-guide",
    title: "Digital Wealth â€“ Ultimate Guide - This Order Includes A Free Extra Bonus.",
    description:
      "Step-by-step strategies for building digital income streams. Includes a surprise bonus resource.",
    price: 28.99,
    originalPrice: 0,
    rating: 4.6,
    reviews: 95,
    downloads: 820,
    category: "Ebooks (Miscellaneous)",
  },
  {
    id: 4,
    slug: "chatgpt-side-hustles",
    title:
      "ChatGPT Side Hustles eBook: 12 AI Income Streams - Beginner's PDF Guide (Digital Download).",
    description:
      "Beginner-friendly guide to 12 ChatGPT-powered side hustles with actionable steps and tools.",
    price: 2.99,
    originalPrice: 0,
    rating: 4.5,
    reviews: 78,
    downloads: 640,
    category: "AI & ChatGPT Guides",
  },
  {
    id: 5,
    slug: "make-money-as-you-sleep",
    title: "Passive Income Ebook: Financial Freedom Guide (Digital Download)",
    description:
      "Learn foundational passive income strategies and systems to build long-term financial freedom.",
    price: 2.99,
    originalPrice: 0,
    rating: 4.4,
    reviews: 66,
    downloads: 590,
    category: "Passive Income & Side Hustles",
  },
];

// Small util so we always show â‚¬ correctly
const formatPrice = (value: number, currency = "EUR", locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

function ProductCard({ product, index }: { product: FeaturedProduct; index: number }) {
  const src = product.image ?? `/images/products/${product.slug}/cover.jpg`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/products/${product.id}`} aria-label={`View ${product.title}`} className="block">
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
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
        >
          <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
        </Link>

        {/* Read more / Show less for the description */}
        <DescriptionClamp
          text={(product.longDescription ?? product.description) as string}
          maxChars={140}
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
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
          <Link href={`/products/${product.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function FeaturedProducts() {
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
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
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
