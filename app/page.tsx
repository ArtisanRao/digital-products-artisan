import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import ProductCategories from "@/components/product-categories"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import FAQSection from "@/components/faq-section"
import LoadingSpinner from "@/components/loading-spinner"

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

      <footer className="text-center text-sm text-gray-400 py-6">
        &copy; {new Date().getFullYear()} Digital Products Artisan. All rights reserved.
      </footer>
    </main>
  )
}
