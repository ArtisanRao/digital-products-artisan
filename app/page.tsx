import type { Metadata } from "next";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import ProductCategories from "@/components/product-categories";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import FAQSection from "@/components/faq-section";
import NewsletterSection from "@/components/newsletter-section";

export const metadata: Metadata = {
  title: "Digital Products Artisan - Premium Digital Goods",
  description:
    "Discover premium digital goods including eBooks, templates, digital art, and more. Shop at Digital Products Artisan for instant downloads and quality content.",
  openGraph: {
    title: "Digital Products Artisan - Premium Digital Goods",
    description:
      "Discover premium digital goods including eBooks, templates, digital art, and more. Shop at Digital Products Artisan for instant downloads and quality content.",
    url: "https://digitalproductsartisan.com",
    siteName: "Digital Products Artisan",
    images: [
      {
        url: "/logo-new.png",
        width: 1200,
        height: 630,
        alt: "Digital Products Artisan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan - Premium Digital Goods",
    description:
      "Discover premium digital goods including eBooks, templates, digital art, and more. Shop at Digital Products Artisan for instant downloads and quality content.",
    images: ["/logo-new.png"],
    creator: "@digitalartisan",
  },
};

export default function Page() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <ProductCategories />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
    </main>
  );
}
