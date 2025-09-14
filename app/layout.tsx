"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";
import AutoCurrency from "@/components/auto-currency";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;

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

        {/* --- Snipcart v3: CSS + preconnect --- */}
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.css"
        />
      </head>

      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* Auto-detect & store currency (EUR by default in Snipcart container below) */}
            <AutoCurrency />

            {/* Site chrome */}
            <Header />
            {children}
            <Footer />
            <LiveChat />
            <Toaster />

            {/* --- Snipcart v3: Script + Container --- */}
            {/* Load after hydration so buttons become interactive */}
            <Script
              src="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.js"
              strategy="afterInteractive"
            />
            {/* Hidden container enables the cart/checkout UI.
                Currency set to EUR; Snipcart will still work with other currencies
                if you switch it in code later. */}
            <div
              hidden
              id="snipcart"
              data-api-key={snipcartKey}
              data-config-modal-style="side"
              data-currency="EUR"
            />

            {/* (Optional) If you want to start the cart open for debugging:
                <Script id="open-cart" strategy="afterInteractive">
                  {`document.addEventListener('snipcart.ready', () => Snipcart.api.theme.cart.open())`}
                </Script>
            */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
