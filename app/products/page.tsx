"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Download, Search, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  category: string
  tags: string[]
  rating: number
  reviews: number
  downloads: number
  bestseller?: boolean
  image?: string
}

const products: Product[] = [
  {
    id: 1,
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Ebooks, Courses, Prompts & More.",
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell ebooks, courses, prompts, templates, and more.",
    price: 42.99,
    originalPrice: 0,
    category: "Complete Shop Packages",
    tags: ["PLR", "MRR", "Bundle", "Resell Rights"],
    rating: 4.8,
    reviews: 210,
    downloads: 1500,
    bestseller: true,
    image: "/images/products/buy-this-complete-shop-cover.jpg",
  },
  {
    id: 2,
    title:
      "Self-Help Ebook: The Art of Giving No F*cks - Minimalist Mindset (Digital Download).",
    description:
      "A practical guide to focus, freedom, and owning your life—minimalist mindset strategies with worksheets.",
    price: 14.99,
    originalPrice: 0,
    category: "Self-Help & How-To",
    tags: ["Mindset", "Self-Help", "Focus", "Minimalism"],
    rating: 4.7,
    reviews: 112,
    downloads: 980,
    bestseller: true,
    image: "/images/products/the-art-of-giving-no-fucks-cover.jpg",
  },
  {
    id: 3,
    title:
      "Digital Wealth – Ultimate Guide - This Order Includes A Free Extra Bonus.",
    description:
      "Step-by-step strategies for building digital income streams. Includes a surprise bonus resource.",
    price: 28.99,
    originalPrice: 0,
    category: "Ebooks (Miscellaneous)",
    tags: ["Wealth", "Business", "Strategy", "Guide"],
    rating: 4.6,
    reviews: 95,
    downloads: 820,
    bestseller: false,
    image: "/images/products/digital-wealth-cover.jpg",
  },
  {
    id: 4,
    title:
      "ChatGPT Side Hustles eBook: 12 AI Income Streams - Beginner's PDF Guide (Digital Download).",
    description:
      "Beginner-friendly guide to 12 ChatGPT-powered side hustles with actionable steps and tools.",
    price: 2.99,
    originalPrice: 0,
    category: "AI & ChatGPT Guides",
    tags: ["AI", "ChatGPT", "Side Hustle", "Beginner"],
    rating: 4.5,
    reviews: 78,
    downloads: 640,
    bestseller: false,
    image: "/images/products/chatgpt-side-hustles-cover.jpg",
  },
  {
    id: 5,
    title:
      "Passive Income Ebook: Financial Freedom Guide (Digital Download)",
    description:
      "Learn foundational passive income strategies and systems to build long-term financial freedom.",
    price: 2.99,
    originalPrice: 0,
    category: "Passive Income & Side Hustles",
    tags: ["Passive Income", "Finance", "Freedom"],
    rating: 4.4,
    reviews: 66,
    downloads: 590,
    bestseller: false,
    image: "/images/products/make-money-as-you-sleep-cover.jpg",
  },
]

const baseCategories = [
  "AI & ChatGPT Guides",
  "Planners & Productivity",
  "Passive Income & Side Hustles",
  "Excel Templates & Guides",
  "Cyber Security",
  "Self-Help & How-To",
  "PLR & MRR Bundles",
  "Health & Fitness Ebooks",
  "Video Courses & Training",
  "Ebooks (Miscellaneous)",
  "Complete Shop Packages",
  "Keto & Diet Guides",
  "Prompt Packs & AI Tools",
]

const categoriesWithCounts = (products: Product[]) => {
  const counts: Record<string, number> = {}
  baseCategories.forEach((cat) => (counts[cat] = 0))
  products.forEach((p) => {
    if (counts[p.category] !== undefined) counts[p.category] += 1
    else counts[p.category] = 1
  })
  return counts
}

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
  const categoryCounts = useMemo(() => categoriesWithCounts(products), [products])

  // Ensure min price <= max price
  const handleMinPriceChange = (value: number) => {
    setPriceRange((prev) => ({ min: Math.min(value, prev.max), max: prev.max }))
  }
  const handleMaxPriceChange = (value: number) => {
    setPriceRange((prev) => ({ min: prev.min, max: Math.max(value, prev.min) }))
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
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
                  <div key="All" className="flex items-center space-x-2">
                    <input
                      id="category-All"
                      name="category"
                      type="radio"
                      checked={selectedCategory === "All"}
                      onChange={() => setSelectedCategory("All")}
                      className="checkbox"
                    />
                    <label htmlFor="category-All" className="text-sm text-gray-700 cursor-pointer">
                      All ({products.length})
                    </label>
                  </div>

                  {baseCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        id={`category-${category}`}
                        name="category"
                        type="radio"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="checkbox"
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-gray-700 cursor-pointer">
                        {category} ({categoryCounts[category] || 0})
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
                          if (checked) setSelectedTags((prev) => [...prev, tag])
                          else setSelectedTags((prev) => prev.filter((t) => t !== tag))
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
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-black font-semibold">
                          Bestseller
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="line-through text-gray-400 ml-2">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button asChild size="sm" variant="outline" aria-label={`Download ${product.title}`}>
                      <Link href={`/products/${product.id}`}>
                        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                        Download
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {sortedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-300"
                  tabIndex={0}
                  aria-label={`Product: ${product.title}`}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={120}
                    height={90}
                    className="flex-shrink-0 rounded-md object-cover"
                    priority
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{product.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-800">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="line-through text-gray-400">${product.originalPrice}</span>
                    )}
                    <Button asChild size="sm" variant="outline" aria-label={`Download ${product.title}`}>
                      <Link href={`/products/${product.id}`}>
                        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                        Download
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
