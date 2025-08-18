"use client"; // Ensure Snipcart buttons work

import { Suspense } from "react";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import ProductCategories from "@/components/product-categories";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import NewsletterSection from "@/components/newsletter-section";
import FAQSection from "@/components/faq-section";
import LoadingSpinner from "@/components/loading-spinner";
import BackToTopButton from "@/components/BackToTopButton";

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
        url: "/images/logo-new.png",
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
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="mt-[38px]">
        <HeroSection />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedProducts />
      </Suspense>

      {/* Product Categories */}
      <ProductCategories />

      {/* Example Snipcart Product */}
      <section className="my-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Sample Product</h2>
        <div className="inline-block border rounded-lg p-6 shadow-lg">
          <img
            src="/images/ebooks-cover.jpg"
            alt="Sample eBook"
            className="w-48 h-48 mx-auto mb-4 object-cover"
          />
          <h3 className="text-lg font-medium mb-2">Mastering Digital Art</h3>
          <p className="mb-4 text-gray-600">A complete guide to creating stunning digital art.</p>
          <button
            className="snipcart-add-item bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            data-item-id="sample-ebook-1"
            data-item-name="Mastering Digital Art"
            data-item-price="19.99"
            data-item-url="/"
            data-item-description="A complete guide to creating stunning digital art."
          >
            Buy Now - $19.99
          </button>
        </div>
      </section>

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
  );
}
