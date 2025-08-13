"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase!.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategory === category}
                        onCheckedChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    className="w-20"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-20"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedTags((prev) => [...prev, tag]);
                          else setSelectedTags((prev) => prev.filter((t) => t !== tag));
                        }}
                      />
                      <label htmlFor={tag} className="text-sm text-gray-700 cursor-pointer">
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-gray-600">
              Showing {sortedProducts.length} of {products.length} products
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.bestseller && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                          Bestseller
                        </Badge>
                      )}
                      <Button size="sm" variant="ghost" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
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
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(product.tags || []).slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
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
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-32 overflow-hidden rounded-lg">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.bestseller && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                              <span className="text-sm text-gray-400">({product.reviews})</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-3">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <Button
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 snipcart-add-item"
                            data-item-id={product.id}
                            data-item-price={product.price}
                            data-item-url={`/products/${product.slug}`}
                            data-item-name={product.name}
                            data-item-description={product.description}
                            data-item-image={product.image_url}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
