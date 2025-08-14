'use client';

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Grid, List, Filter, X } from "lucide-react";
import Image from "next/image";

const categories = ["All", "AI Prompts", "Templates", "Ebooks", "Planners", "Courses"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  tags?: string[];
  downloads?: number;
  rating?: number;
  image_url?: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setError("Supabase configuration missing. Products cannot be loaded.");
        setLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      setLoading(true);

      try {
        const { data, error } = await supabase.from<"products", Product>("products").select("*");
        if (error) throw error;
        if (!data || data.length === 0) {
          setError("No products available right now.");
          setProducts([]);
          return;
        }
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(`Failed to load products: ${err.message || err}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => (product.tags || []).includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return (b.downloads || 0) - (a.downloads || 0);
    }
  });

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        {error}
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"}>
            <Grid size={18} />
          </Button>
          <Button onClick={() => setViewMode("list")} variant={viewMode === "list" ? "default" : "outline"}>
            <List size={18} />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {sortedProducts.map((product) => (
          <Card key={product.id} className={viewMode === "list" ? "flex gap-4 p-4" : ""}>
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                width={viewMode === "grid" ? 400 : 150}
                height={viewMode === "grid" ? 250 : 150}
                className="rounded object-cover"
              />
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{product.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags?.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <Button>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
