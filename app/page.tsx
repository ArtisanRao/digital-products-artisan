import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Categories from "@/components/Categories";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";

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
        url: "/logo-new.png", // ✅ unified with layout.tsx
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
    images: ["/logo-new.png"], // ✅ unified with layout.tsx
    creator: "@digitalartisan",
  },
};

export default function Page() {
  return (
    <main>
      <Hero />
      <Features />
      <Products />
      <Categories />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </main>
  );
}
