import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredProducts = [
  {
    id: 1,
    title:
      "Buy This Complete Shop - PLR MRR Digital Product: Resell Ebooks, Courses, Prompts & More.",
    description:
      "Complete, rights-included digital shop bundle. Rebrand and resell ebooks, courses, prompts, templates, and more.",
    price: 42.99,
    originalPrice: 0,
    rating: 4.8,
    reviews: 210,
    downloads: 1500,
    category: "Complete Shop Packages",
    image: "/images/products/buy-this-complete-shop-cover.jpg",
    bestseller: true,
  },
  {
    id: 2,
    title:
      "Self-Help Ebook: The Art of Giving No F*cks - Minimalist Mindset (Digital Download).",
    description:
      "A practical guide to focus, freedom, and owning your life—minimalist mindset strategies with worksheets.",
    price: 14.99,
    originalPrice: 0,
    rating: 4.7,
    reviews: 112,
    downloads: 980,
    category: "Self-Help & How-To",
    image: "/images/products/the-art-of-giving-no-fucks-cover.jpg",
    bestseller: true,
  },
  {
    id: 3,
    title:
      "Digital Wealth – Ultimate Guide - This Order Includes A Free Extra Bonus.",
    description:
      "Step-by-step strategies for building digital income streams. Includes a surprise bonus resource.",
    price: 28.99,
    originalPrice: 0,
    rating: 4.6,
    reviews: 95,
    downloads: 820,
    category: "Ebooks (Miscellaneous)",
    image: "/images/products/digital-wealth-cover.jpg",
    bestseller: false,
  },
  {
    id: 4,
    title:
      "ChatGPT Side Hustles eBook: 12 AI Income Streams - Beginner's PDF Guide (Digital Download).",
    description:
      "Beginner-friendly guide to 12 ChatGPT-powered side hustles with actionable steps and tools.",
    price: 2.99,
    originalPrice: 0,
    rating: 4.5,
    reviews: 78,
    downloads: 640,
    category: "AI & ChatGPT Guides",
    image: "/images/products/chatgpt-side-hustles-cover.jpg",
    bestseller: false,
  },
  {
    id: 5,
    title: "Passive Income Ebook: Financial Freedom Guide (Digital Download)",
    description:
      "Learn foundational passive income strategies and systems to build long-term financial freedom.",
    price: 2.99,
    originalPrice: 0,
    rating: 4.4,
    reviews: 66,
    downloads: 590,
    category: "Passive Income & Side Hustles",
    image: "/images/products/make-money-as-you-sleep-cover.png",
    bestseller: false,
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Best Selling Digital Products
          </h2>
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
                    priority
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
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
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
