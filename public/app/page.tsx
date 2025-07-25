import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import ProductCategories from "@/components/product-categories"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import FAQSection from "@/components/faq-section"
import LoadingSpinner from "@/components/loading-spinner"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedProducts />
      </Suspense>
      <ProductCategories />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </main>
  )
}
