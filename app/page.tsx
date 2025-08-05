import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import ProductCategories from "@/components/product-categories"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import FAQSection from "@/components/faq-section"
import LoadingSpinner from "@/components/loading-spinner"
import BackToTopButton from "@/components/BackToTopButton" // ✅ Import this

export const metadata = {
  title: "Digital Products Artisan | Premium Digital Downloads",
  description: "Instantly download ebooks, templates, graphics, and more — created for creators.",
  openGraph: {
    title: "Digital Products Artisan",
    description: "Premium digital downloads. Instant access. No fluff.",
    url: "https://digitalproductsartisan.com",
    siteName: "Digital Products Artisan",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Products Artisan",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description: "High-quality digital downloads at your fingertips.",
    images: ["/images/logo.png"],
  },
}

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

      <footer className="text-center text-sm text-gray-500 py-6 space-y-2">
        <div>
          &copy; {new Date().getFullYear()} Digital Products Artisan. All rights reserved.
        </div>
        <div className="space-x-4">
          <a href="/contact" className="hover:underline text-blue-600">Contact</a>
          <a href="/privacy" className="hover:underline text-blue-600">Privacy</a>
          <a href="/help" className="hover:underline text-blue-600">Support</a>
        </div>
      </footer>

      <BackToTopButton />
    </main>
  )
}
