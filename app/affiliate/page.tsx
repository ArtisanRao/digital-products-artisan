import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, TrendingUp, Gift, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function AffiliatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Join Our Affiliate Program</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Earn generous commissions by promoting high-quality digital products. Join thousands of successful affiliates
          earning passive income with Digital Products Artisan.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          asChild
        >
          <Link href="/affiliate/signup">Start Earning Today</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">50%</div>
            <div className="text-gray-600">Commission Rate</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">2,500+</div>
            <div className="text-gray-600">Active Affiliates</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">$1.2M+</div>
            <div className="text-gray-600">Paid in Commissions</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Gift className="w-8 h-8 text-pink-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">30 days</div>
            <div className="text-gray-600">Cookie Duration</div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-purple-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up Free</h3>
            <p className="text-gray-600">
              Join our affiliate program in minutes. Get instant access to your dashboard and marketing materials.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Promote Products</h3>
            <p className="text-gray-600">
              Share your unique affiliate links through your blog, social media, email, or any marketing channel.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn Commissions</h3>
            <p className="text-gray-600">
              Earn 50% commission on every sale. Get paid monthly via PayPal, bank transfer, or crypto.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our Program?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">High Converting Products</h3>
              <p className="text-gray-600">
                Our products have proven conversion rates with satisfied customers and positive reviews.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Materials</h3>
              <p className="text-gray-600">
                Get access to banners, email templates, product images, and copy that converts.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Monitor your clicks, conversions, and earnings with our advanced affiliate dashboard.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                Our affiliate managers are here to help you succeed with personalized support and tips.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Commission Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Starter</CardTitle>
              <div className="text-3xl font-bold text-gray-900">30%</div>
              <p className="text-gray-600">0-10 sales/month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Basic marketing materials
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Monthly payments
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Email support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">Most Popular</Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Pro</CardTitle>
              <div className="text-3xl font-bold text-purple-600">40%</div>
              <p className="text-gray-600">11-50 sales/month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Premium marketing materials
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Bi-weekly payments
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Custom landing pages
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-gold-500">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Elite</CardTitle>
              <div className="text-3xl font-bold text-yellow-600">50%</div>
              <p className="text-gray-600">50+ sales/month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Exclusive marketing materials
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Weekly payments
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Dedicated account manager
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Custom product creation
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Our Affiliates Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I've been promoting Digital Products Artisan for 6 months and consistently earn $3,000+ monthly. The
                products sell themselves and the support team is amazing!"
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-500">Content Creator & Affiliate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The conversion rates are incredible. I promote these products to my email list and consistently see
                8-12% conversion rates. Best affiliate program I've joined!"
              </p>
              <div className="font-semibold text-gray-900">Mike Chen</div>
              <div className="text-sm text-gray-500">Digital Marketer</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our affiliate program today and start earning generous commissions on every sale.
        </p>
        <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
          <Link href="/affiliate/signup">Join Now - It's Free</Link>
        </Button>
      </div>
    </div>
  )
}
