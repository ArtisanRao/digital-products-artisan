"use client"; // This is a client component

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// Snipcart loader component
function SnipcartLoader() {
  useEffect(() => {
    // Inject Snipcart settings before loading script
    if (!document.getElementById("snipcart-settings")) {
      const settingsScript = document.createElement("script");
      settingsScript.id = "snipcart-settings";
      settingsScript.type = "text/javascript";
      settingsScript.innerHTML = `
        window.SnipcartSettings = {
          publicApiKey: "ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4",
          loadStrategy: "on-user-interaction",
          modalStyle: "side"
        };
      `;
      document.head.appendChild(settingsScript);
    }

    // Add Snipcart div
    if (!document.getElementById("snipcart")) {
      const snipcartDiv = document.createElement("div");
      snipcartDiv.id = "snipcart";
      snipcartDiv.hidden = true;
      document.body.appendChild(snipcartDiv);
    }

    // Add Snipcart script
    if (!document.getElementById("snipcart-script")) {
      const script = document.createElement("script");
      script.id = "snipcart-script";
      script.src = "https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Basic SEO */}
        <title>Digital Products Artisan</title>
        <meta
          name="description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />

        {/* PWA & manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />

        {/* Favicons updated with new logo */}
        <link rel="icon" href="/logo-new.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo-new.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-new.png" />

        {/* Open Graph (Facebook, LinkedIn, etc.) */}
        <meta property="og:title" content="Digital Products Artisan" />
        <meta
          property="og:description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />
        <meta
          property="og:image"
          content="https://digitalproductsartisan.com/logo-new.png"
        />
        <meta property="og:url" content="https://digitalproductsartisan.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Digital Products Artisan" />
        <meta
          name="twitter:description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />
        <meta
          name="twitter:image"
          content="https://digitalproductsartisan.com/logo-new.png"
        />

        {/* Schema.org JSON-LD for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Digital Products Artisan",
              url: "https://digitalproductsartisan.com",
              logo: "https://digitalproductsartisan.com/logo-new.png",
            }),
          }}
        />

        {/* Snipcart CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.css"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <SnipcartLoader />
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
