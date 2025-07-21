import { Card, CardContent } from "@/components/ui/card"
import { FileText, Palette, Zap, Calendar, Code, Camera } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Ebooks & Guides",
    description: "Comprehensive guides and educational content",
    icon: FileText,
    count: 45,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Templates & Graphics",
    description: "Ready-to-use design templates and graphics",
    icon: Palette,
    count: 78,
    color: "bg-blue-200 text-blue-700",
  },
  {
    id: 3,
    name: "AI Prompts",
    description: "Curated prompts for AI tools and platforms",
    icon: Zap,
    count: 156,
    color: "bg-blue-300 text-blue-800",
  },
  {
    id: 4,
    name: "Planners & Organizers",
    description: "Digital planners and productivity tools",
    icon: Calendar,
    count: 32,
    color: "bg-blue-400 text-blue-900",
  },
  {
    id: 5,
    name: "Code & Development",
    description: "Scripts, plugins, and development resources",
    icon: Code,
    count: 23,
    color: "bg-blue-50 text-blue-500",
  },
  {
    id: 6,
    name: "Photography & Media",
    description: "Stock photos, presets, and media assets",
    icon: Camera,
    count: 67,
    color: "bg-blue-700 text-blue-50",
  },
]

export default function ProductCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need from our organized collection of digital products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
