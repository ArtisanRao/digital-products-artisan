import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The AI prompt pack completely transformed my content creation process. I've saved hours of brainstorming time and my engagement has increased by 300%!",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Small Business Owner",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "These Canva templates are incredible! Professional designs that would have cost me thousands from a designer. My social media looks amazing now.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Digital Marketer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The digital marketing ebook is pure gold. Implemented the strategies and saw immediate results. Best investment I've made for my business.",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied creators who've transformed their work with our digital products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-purple-200 mb-4" />
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
