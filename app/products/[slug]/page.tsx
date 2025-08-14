// Temporary change to trigger git commit

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Heart } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading product...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="p-0">
          <div className="relative w-full h-96">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-t-lg"
            />
            {product.bestseller && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                Bestseller
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(product.tags || []).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 snipcart-add-item"
            data-item-id={product.id}
            data-item-price={product.price}
            data-item-url={`/products/${product.slug}`}
            data-item-name={product.name}
            data-item-description={product.description}
            data-item-image={product.image_url}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
