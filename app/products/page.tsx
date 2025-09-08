"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Download, Heart, Search, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const products = [
  // ... your products as before ...
]

const categories = ["All", "AI Prompts", "Templates", "Ebooks", "Planners", "Courses"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => Array.from(new Set(products.flatMap((p) => p.tags))), [])

  // Ensure min price <= max price
  const handleMinPriceChange = (value: number) => {
    setPriceRange((prev) => ({
      min: Math.min(value, prev.max),
      max: prev.max,
    }))
  }
  const handleMaxPriceChange = (value: number) => {
    setPriceRange((prev) => ({
      min: prev.min,
      max: Math.max(value, prev.min),
    }))
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag))

      return matchesSearch && matchesCategory && matchesPrice && matchesTags
    })
  }, [searchQuery, selectedCategory, priceRange, selectedTags])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id - a.id
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return b.downloads - a.downloads
      }
    })
  }, [filteredProducts, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Digital Products</h1>
        <p className="text-lg text-gray-600">
          Discover our complete collection of digital downloads for creators and entrepreneurs
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6" aria-label="Filters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label htmlFor="product-search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    aria-hidden="true"
                  />
                  <Input
                    id="product-search"
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search products"
                  />
                </div>
              </div>

              {/* Categories (radio buttons for single select) */}
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2 block">Category</legend>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        id={`category-${category}`}
                        name="category"
                        type="radio"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="checkbox"
                        aria-checked={selectedCategory === category}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                    className="w-20"
                    min={0}
                    aria-label="Minimum price"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                    className="w-20"
                    min={0}
                    aria-label="Maximum price"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                <div className="space-y-2 max-h-40 overflow-y-auto" role="group" aria-label="Filter by tags">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (typeof checked !== "boolean") return
                          if (checked) {
                            setSelectedTags((prev) => [...prev, tag])
                          } else {
                            setSelectedTags((prev) => prev.filter((t) => t !== tag))
                          }
                        }}
                      />
                      <label htmlFor={`tag-${tag}`} className="text-sm text-gray-700 cursor-pointer">
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <section className="flex-1" aria-label="Products">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-gray-600" aria-live="polite">
              Showing {sortedProducts.length} of {products.length} products
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy} aria-label="Sort products">
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

              <div className="flex border rounded-lg" role="group" aria-label="Toggle view mode">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                  aria-pressed={viewMode === "grid"}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                  aria-pressed={viewMode === "list"}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow duration-300"
                  tabIndex={0}
                  aria-label={`Product: ${product.title}`}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                      />
                      {product.bestseller && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                          Bestseller
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        aria-label={`Add ${product.title} to wishlist`}
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
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Download className="w-4 h-4 mr-1" />
                        {product.downloads}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>Add to Cart</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow duration-300"
                  tabIndex={0}
                  aria-label={`Product: ${product.title}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-48 h-32 overflow-hidden rounded-lg">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          priority
                        />
                        {product.bestseller && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600">
                            Bestseller
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary">{product.category}</Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600">{product.rating}</span>
                                <span className="text-sm text-gray-400">({product.reviews})</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                            <p className="text-gray-600 mb-3">{product.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {product.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            <Button
                              size="sm"
                              variant="default"
                              asChild
                              className="w-full"
                              aria-label={`Add ${product.title} to cart`}
                            >
                              <Link href={`/products/${product.id}`}>Add to Cart</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
