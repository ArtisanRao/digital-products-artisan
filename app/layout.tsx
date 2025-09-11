"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";
import CurrencyPicker from "@/components/currency-picker";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Digital Products Artisan</title>
        <meta
          name="description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />

        {/* PWA / icons */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />
        <link rel="icon" href="/images/logo-new.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/images/logo-new.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo-new.png" />

        {/* Social */}
        <meta property="og:title" content="Digital Products Artisan" />
        <meta
          property="og:description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />
        <meta property="og:image" content="https://digitalproductsartisan.com/images/logo-new.png" />
        <meta property="og:url" content="https://digitalproductsartisan.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Products Artisan" />
        <meta
          name="twitter:description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />
        <meta name="twitter:image" content="https://digitalproductsartisan.com/images/logo-new.png" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Digital Products Artisan",
              url: "https://digitalproductsartisan.com",
              logo: "https://digitalproductsartisan.com/images/logo-new.png",
            }),
          }}
        />
        {/* Snipcart assets removed; Stripe handles checkout */}
      </head>

      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* Currency picker bar (visible on every page) */}
            <div className="border-b bg-gray-50">
              <div className="container mx-auto flex items-center justify-end px-4 py-2">
                <CurrencyPicker />
              </div>
            </div>

            <Header />
            {children}
            <Footer />
            <LiveChat />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
