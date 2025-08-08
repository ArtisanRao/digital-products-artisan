
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Zap, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100/50 py-12 md:py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-32 right-20 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Instant Access. Unlimited Possibilities.
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            Digital Products{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent relative">
              Artisan
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-30"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Fuel Your Creativity. Build Your Vision. Explore high-quality digital downloads—ebooks, templates, prompt
            packs, and more—crafted to empower creators, entrepreneurs, and lifelong learners.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
              asChild
            >
              <Link href="/products">
                Explore Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
            >
              <Link href="/bundles">
                <Download className="mr-2 w-5 h-5" />
                View Bundles
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Instant Downloads</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your products immediately after purchase with secure, lifetime access
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Expertly Designed</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional quality resources crafted by industry experts
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Always Ready</h3>
              <p className="text-gray-600 leading-relaxed">Available 24/7 when inspiration strikes, wherever you are</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 