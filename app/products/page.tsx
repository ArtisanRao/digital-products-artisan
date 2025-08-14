'use client';

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Download, Heart, Search, Filter, Grid, List } from "lucide-react";
import Image from "next/image";

const categories = ["All", "AI Prompts", "Templates", "Ebooks", "Planners", "Courses"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch products from Supabase safely
  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error(err);
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
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => (product.tags || []).includes(tag));

    return matchesSearch && matchesCategory && matchesPrice && matchesTags;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Digital Products</h1>
        <p className="text-lg text-gray-600">
          Discover our complete collection of digital downloads for creators and entrepreneurs
        </p>
        {user && <p className="text-sm mt-2 text-gray-500">Logged in as {user.email}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          {/* ...Filters UI remains exactly the same... */}
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {/* ...Toolbar and Products rendering remains exactly the same... */}
        </div>
      </div>
    </div>
  );
}
