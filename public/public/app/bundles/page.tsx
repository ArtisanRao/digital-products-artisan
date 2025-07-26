import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Package, Percent } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const bundles = [
  {
    id: 1,
    title: "Complete Creator Bundle",
    description: "Everything you need to start and grow your creative business",
    price: 79.99,
    originalPrice: 149.99,
    savings: 47,
    rating: 4.9,
    reviews: 156,
    downloads: 890,
    itemCount: 8,
    items: [
      "Ultimate AI Prompt Pack",
      "Canva Template Bundle",
      "Digital Marketing Ebook",
      "Notion Productivity System",
      "Instagram Story Templates",
      "Brand Identity Kit",
      "Content Calendar Template",
      "Email Marketing Templates",
    ],
    image: "/placeholder.svg?height=300&width=400",
    popular: true,
  },
  {
    id: 2,
    title: "Social Media Master Pack",
    description: "Templates and guides for dominating social media platforms",
    price: 49.99,
    originalPrice: 89.99,
    savings: 44,
    rating: 4.8,
    reviews: 203,
    downloads: 567,
    itemCount: 5,
    items: [
      "Instagram Story Templates",
      "Facebook Post Templates",
      "LinkedIn Content Kit",
      "Social Media Strategy Guide",
      "Hashtag Research Tool",
    ],
    image: "/placeholder.svg?height=300&width=400",
    popular: false,
  },
  {
    id: 3,
    title: "Business Starter Bundle",
    description: "Essential tools and resources for new entrepreneurs",
    price: 59.99,
    originalPrice: 119.99,
    savings: 50,
    rating: 4.7,
    reviews: 134,
    downloads: 445,
    itemCount: 6,
    items: [
      "Business Plan Template",
      "Financial Planning Spreadsheet",
      "Legal Document Templates",
      "Marketing Strategy Guide",
      "Pitch Deck Template",
      "Brand Guidelines Template",
    ],
    image: "/placeholder.svg?height=300&width=400",
    popular: false,
  },
  {
    id: 4,
    title: "AI Productivity Suite",
    description: "Harness the power of AI for maximum productivity",
    price: 39.99,
    originalPrice: 79.99,
    savings: 50,
    rating: 4.9,
    reviews: 298,
    downloads: 1100,
    itemCount: 4,
    items: [
      "Ultimate AI Prompt Pack",
      "ChatGPT Workflow Templates",
      "AI Writing Assistant Guide",
      "Automation Setup Templates",
    ],
    image: "/placeholder.svg?height=300&width=400",
    popular: true,
  },
]

export default function BundlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Bundles</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Save big with our carefully curated bundles. Get multiple premium products at incredible discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="group hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={bundle.image || "/placeholder.svg"}
                  alt={bundle.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {bundle.popular && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                    Most Popular
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  -{bundle.savings}%
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">{bundle.itemCount} Products</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{bundle.rating}</span>
                  <span className="text-sm text-gray-400">({bundle.reviews})</span>
                </div>
              </div>

              <CardTitle className="text-xl mb-3">{bundle.title}</CardTitle>
              <p className="text-gray-600 mb-4">{bundle.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                <ul className="space-y-1">
                  {bundle.items.slice(0, 4).map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                  {bundle.items.length > 4 && (
                    <li className="text-sm text-purple-600 font-medium">+ {bundle.items.length - 4} more items</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900">${bundle.price}</span>
                  <span className="text-lg text-gray-500 line-through">${bundle.originalPrice}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Percent className="w-3 h-3 mr-1" />
                    Save ${(bundle.originalPrice - bundle.price).toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Download className="w-4 h-4 mr-1" />
                  {bundle.downloads}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                asChild
              >
                <Link href={`/bundles/${bundle.id}`}>Get This Bundle</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/bundles/${bundle.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Bundle FAQ */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bundle FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How do bundles work?</h3>
            <p className="text-gray-600 text-sm">
              Bundles combine multiple related products at a significant discount. You get instant access to all items
              with a single purchase.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I buy individual items?</h3>
            <p className="text-gray-600 text-sm">
              Yes! All items in bundles are available individually, but you'll save more by purchasing the complete
              bundle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Do I get updates?</h3>
            <p className="text-gray-600 text-sm">
              Bundle purchases include lifetime access and any future updates to the included products.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What if I already own some items?</h3>
            <p className="text-gray-600 text-sm">
              Contact our support team for a custom discount if you already own products included in a bundle you want
              to purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
