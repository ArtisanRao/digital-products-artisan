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
        // FIX: Supabase v2 expects 2 type arguments
        const { data, error } = await supabase.from<Product, Product>("products").select("*");
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
  if (error) return (
    <div className="p-8 text-center text-red-500">
      {error}
      <div className="mt-4"><Button onClick={() => window.location.reload()}>Retry</Button></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Digital Products</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Discover our complete collection of digital downloads for creators and entrepreneurs
          </p>
          {user && <p className="text-sm mt-1 text-gray-500">Logged in as {user.email}</p>}
        </div>
        {/* Mobile filter toggle */}
        <Button className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
          {filtersOpen ? <X /> : <Filter />}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Overlay */}
        {filtersOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setFiltersOpen(false)}
          ></div>
        )}

        {/* Filters Sidebar */}
        <div
          className={`lg:w-64 space-y-6 fixed lg:static top-0 left-0 h-full bg-white z-50 p-4 shadow-lg transform transition-transform duration-300 ease-in-out
            ${filtersOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:h-auto lg:shadow-none`}
        >
          {/* Search */}
          <div>
            <input
              placeholder="Search products..."
              className="w-full px-3 py-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="mb-1 w-full text-left"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              {allTags.map((tag) => (
                <Checkbox
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => {
                    if (checked) setSelectedTags([...selectedTags, tag]);
                    else setSelectedTags(selectedTags.filter((t) => t !== tag));
                  }}
                  className="mb-1"
                >
                  {tag}
                </Checkbox>
              ))}
            </div>
          )}

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-2">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-2 mt-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}>
              <Grid />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
              <List />
            </Button>
          </div>

          {/* Close button for mobile */}
          <Button className="lg:hidden mt-4" onClick={() => setFiltersOpen(false)}>
            <X /> Close
          </Button>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1 lg:ml-64">
          {sortedProducts.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {sortedProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{product.description}</p>
                    {product.image_url && (
                      <Image src={product.image_url} alt={product.name} width={300} height={200} className="mt-2 rounded" />
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags?.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <Button>Buy</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating mobile filter button */}
      {!filtersOpen && (
        <Button
          className="fixed bottom-4 right-4 lg:hidden rounded-full p-4 shadow-lg z-40"
          onClick={() => setFiltersOpen(true)}
        >
          <Filter />
        </Button>
      )}
    </div>
  );
}
