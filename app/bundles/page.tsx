"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Package, Percent } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InlineMore from "@/components/ui/inline-more";

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

const bundles = [/* … your bundle objects unchanged … */];

export default function BundlesPage() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  async function handleCheckout(bundle: (typeof bundles)[number]) {
    try {
      setLoadingSlug(bundle.title);
      // POST JSON body that your API expects (BodyLines shape)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "eur",
          lines: [
            {
              id: `bundle:${slugify(bundle.title)}`,
              name: bundle.title,
              price: bundle.price,          // server will prefer catalog, but this is fine as fallback
              image: bundle.image,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        console.error("Checkout failed:", data);
        alert(data?.error || "Unable to start checkout.");
        return;
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Checkout error. Please try again.");
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Bundles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Save big with our carefully curated bundles. Get multiple premium products at incredible discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {bundles.map((bundle) => {
          const bundleSlug = slugify(bundle.title);

          return (
            <Card key={bundle.id} className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="relative w-full aspect-[16/9] bg-gray-100">
                    <Image
                      src={bundle.image}
                      alt={bundle.title}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {bundle.popular && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                      Most Popular
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{bundle.savings}%
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">{bundle.itemCount} Products</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{bundle.rating}</span>
                    <span className="text-sm text-gray-400">({bundle.reviews})</span>
                  </div>
                </div>

                <CardTitle className="text-xl mb-2">{bundle.title}</CardTitle>

                {/* Tiny InlineMore always renders toggler (even if short) by using lines=1 */}
                <InlineMore
                  text={bundle.description}
                  lines={1}
                  className="text-gray-600 text-sm mb-4"
                  moreLabel="More"
                  lessLabel="Less"
                />

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {bundle.items.slice(0, 4).map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                    {bundle.items.length > 4 && (
                      <li className="text-sm text-purple-600 font-medium">
                        + {bundle.items.length - 4} more items
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatEUR(bundle.price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatEUR(bundle.originalPrice)}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Percent className="w-3 h-3 mr-1" />
                      Save {formatEUR(bundle.originalPrice - bundle.price)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    {bundle.downloads}
                  </div>
                </div>
              </CardContent>

              {/* SIDE-BY-SIDE CTAs */}
              <CardFooter className="p-6 pt-0">
                <div className="w-full grid grid-cols-2 gap-3">
                  {/* View details → static bundle page you created */}
                  <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <Link href={`/bundles/${bundleSlug}`}>View details</Link>
                  </Button>

                  {/* Get this bundle → POST JSON then redirect to session.url */}
                  <Button
                    onClick={() => handleCheckout(bundle)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-70"
                    disabled={loadingSlug === bundle.title}
                  >
                    {loadingSlug === bundle.title ? "Starting checkout…" : "Get this bundle"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ … unchanged */}
    </div>
  );
}
