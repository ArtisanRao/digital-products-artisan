// app/bundles/page.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Package, Percent } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InlineMore from "@/components/ui/inline-more";

// ⬇️ Single source of truth for bundles (prices, slugs, etc.)
import { bundles } from "./data";

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function BundlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Bundles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Save big with our carefully curated bundles. Get multiple premium products at incredible discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {bundles.map((b) => {
          const price = b.price ?? 0;
          const original = b.originalPrice ?? 0;
          const saveAmt = original > price ? original - price : 0;
          const savePct =
            original > 0 ? Math.max(0, Math.min(100, Math.round((saveAmt / original) * 100))) : 0;

          // Force EUR so Checkout shows the Card/Klarna selector like products
          const checkoutHref = `/api/checkout?slug=${encodeURIComponent(
            `bundle:${b.slug}`
          )}&qty=1&currency=EUR`;

          const itemCount = Array.isArray(b.items) ? b.items.length : 0;
          const rating = (b as any).rating as number | undefined;
          const reviews = (b as any).reviews as number | undefined;
          const downloads = (b as any).downloads as number | undefined;
          const popular = Boolean((b as any).popular);

          const title = b.title;
          const image = b.image;
          const description = b.short ?? b.description ?? "";

          return (
            <Card key={b.slug} className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="relative w-full aspect-[16/9] bg-gray-100">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={false}
                    />
                  </div>

                  {popular && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                      Most Popular
                    </Badge>
                  )}

                  {savePct > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      -{savePct}%
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">{itemCount} Products</span>
                  </div>
                  {typeof rating === "number" && typeof reviews === "number" ? (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({reviews})</span>
                    </div>
                  ) : null}
                </div>

                <CardTitle className="text-xl mb-2">{title}</CardTitle>

                <InlineMore
                  text={description}
                  lines={2}
                  className="text-gray-600 text-sm mb-1"
                  moreLabel="More"
                  lessLabel="Less"
                  forceLink
                  linkClassName="mt-1 text-xs font-medium text-blue-600 hover:underline"
                />

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {(b.items ?? []).slice(0, 4).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                    {itemCount > 4 && (
                      <li className="text-sm text-purple-600 font-medium">+ {itemCount - 4} more items</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">{formatEUR(price)}</span>
                    {original > price ? (
                      <>
                        <span className="text-lg text-gray-500 line-through">{formatEUR(original)}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Percent className="w-3 h-3 mr-1" />
                          Save {formatEUR(saveAmt)}
                        </Badge>
                      </>
                    ) : null}
                  </div>
                  {typeof downloads === "number" ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="w-4 h-4 mr-1" />
                      {downloads}
                    </div>
                  ) : <span />}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <div className="w-full grid grid-cols-2 gap-3">
                  <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Link href={`/bundles/${b.slug}`} prefetch>
                      View details
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Link href={checkoutHref} prefetch={false}>
                      Get this bundle
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bundle FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How do bundles work?</h3>
            <p className="text-gray-600 text-sm">
              Bundles combine multiple related products at a significant discount. You get instant access to all items
              with a single purchase.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I buy individual items?</h3>
            <p className="text-gray-600 text-sm">
              Yes! All items in bundles are available individually, but you'll save more by purchasing the complete
              bundle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Do I get updates?</h3>
            <p className="text-gray-600 text-sm">
              Bundle purchases include lifetime access and any future updates to the included products.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What if I already own some items?</h3>
            <p className="text-gray-600 text-sm">
              Contact our support team for a custom discount if you already own products included in a bundle you want
              to purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
