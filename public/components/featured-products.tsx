import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredProducts = [
  {
    id: 1,
    title: "Ultimate AI Prompt Pack",
    description: "500+ ChatGPT prompts for content creators, marketers, and entrepreneurs",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviews: 234,
    downloads: 1250,
    category: "AI Prompts",
    image: "/placeholder.svg?height=300&width=400",
    bestseller: true,
  },
  {
    id: 2,
    title: "Canva Template Bundle",
    description: "50 professional social media templates for Instagram, Facebook, and LinkedIn",
    price: 19.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviews: 189,
    downloads: 890,
    category: "Templates",
    image: "/placeholder.svg?height=300&width=400",
    bestseller: false,
  },
  {
    id: 3,
    title: "Digital Marketing Ebook",
    description: "Complete guide to building your online presence and growing your audience",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.7,
    reviews: 156,
    downloads: 567,
    category: "Ebooks",
    image: "/placeholder.svg?height=300&width=400",
    bestseller: false,
  },
  {
    id: 4,
    title: "Notion Productivity System",
    description: "Complete workspace template for project management and goal tracking",
    price: 15.99,
    originalPrice: 25.99,
    rating: 4.9,
    reviews: 298,
    downloads: 1100,
    category: "Planners",
    image: "/placeholder.svg?height=300&width=400",
    bestseller: true,
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Best Selling Digital Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular digital downloads that creators love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.bestseller && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-600">
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
                <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
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
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  asChild
                >
                  <Link href={`/products/${product.id}`}>Add to Cart</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
