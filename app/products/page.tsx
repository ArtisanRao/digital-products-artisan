"use client"

import { useState, useEffect } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Download, Heart, Search, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Safe Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lwcrabjetfsxncfygtvq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Y3JhYm" +
  "pldGZzeG5jZnlndHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzYyOTIsImV4cCI6MjA3MDA1MjI5Mn0.04V_2Egctqf4-BbO8ZX4ITADarEpQVcl7Ow1zD5poqs"

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

const categories = ["All", "AI Prompts", "Templates", "Ebooks", "Planners", "Courses"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("products").select("*")
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => (product.tags || []).includes(tag))

    return matchesSearch && matchesCategory && matchesPrice && matchesTags
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id - a.id
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return (b.downloads || 0) - (a.downloads || 0)
    }
  })

  if (loading) return <div className="p-8 text-center">Loading products...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ...rest of your ProductsPage JSX unchanged... */}
      {/* Filters Sidebar, Toolbar, Products Grid/List, No Products Message */}
      {/* You can reuse all your existing JSX here, the Supabase client merge is done */}
    </div>
  )
}
