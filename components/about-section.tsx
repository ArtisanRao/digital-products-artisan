import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Download, Award } from "lucide-react"
import Link from "next/link"

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Digital Products Artisan</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At Digital Products Artisan, we believe in the power of digital tools to transform ideas into impact. From
              sleek templates and productivity guides to AI prompt packs and branding kits, everything we offer is
              designed to help you work smarter, create better, and grow faster.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ready to bring your next big idea to life? Let's make it happen.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Instant Downloads</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Expertly Designed Resources</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Always Ready When You Are</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              asChild
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-cyan-50 rounded-lg">
              <Download className="w-8 h-8 text-cyan-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Downloads</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
