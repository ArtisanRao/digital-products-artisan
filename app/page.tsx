"use client";

import type { Metadata } from "next";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import ProductCategories from "@/components/product-categories";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import FAQSection from "@/components/faq-section";
import NewsletterSection from "@/components/newsletter-section";
import BackToTopButton from "@/components/back-to-top-button";
import LoadingSpinner from "@/components/loading-spinner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Digital Products Artisan | Premium Digital Downloads",
  description:
    "Instantly download ebooks, templates, graphics, and more — created for creators.",
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
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description: "High-quality digital downloads at your fingertips.",
    images: ["/images/logo-new.png"],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mt-[38px]">
        <HeroSection />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedProducts />
      </Suspense>

      <ProductCategories />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />

      <footer className="text-center text-sm text-gray-500 py-6 space-y-2">
        <div>&copy; {new Date().getFullYear()} Digital Products Artisan. All rights reserved.</div>
        <div className="space-x-4">
          <a href="/contact" className="hover:underline text-blue-600">
            Contact
          </a>
          <a href="/privacy" className="hover:underline text-blue-600">
            Privacy
          </a>
          <a href="/help" className="hover:underline text-blue-600">
            Support
          </a>
        </div>
      </footer>

      <BackToTopButton />
    </main>
  );
}
