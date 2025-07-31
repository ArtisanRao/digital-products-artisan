"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Successfully subscribed!",
      description: "Check your email for your free starter pack.",
    })

    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Free Resources & Updates</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter and get a free starter pack of templates, plus exclusive discounts and early
            access to new products.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-gray-900 placeholder-gray-500"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap"
            >
              {isLoading ? "Subscribing..." : "Get Free Pack"}
            </Button>
          </form>

          <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
            <Gift className="w-4 h-4" />
            <span>Free starter pack • No spam • Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
