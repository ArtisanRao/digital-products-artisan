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
import React from "react";

const inter = Inter({ subsets: ["latin"], display: "swap" });

/** Bump this on each deploy to force clients to unregister old SW and clear caches */
const BUILD_TAG = "sw-flush-2025-09-26-g";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;
  const hasSnipcart = !!snipcartKey;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Digital Products Artisan</title>

        {/* Build/debug marker so you can confirm the new layout is live */}
        <meta name="x-build-tag" content={BUILD_TAG} />

        {/* Mobile fit */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        <link rel="canonical" href="https://digitalproductsartisan.com/" />

        <meta
          name="description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />

        {/* PWA / icons (served from /public) */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

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

        {/* Snipcart v3 CSS + preconnect (only if key present) */}
        {hasSnipcart && (
          <>
            <link rel="preconnect" href="https://app.snipcart.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://cdn.snipcart.com" crossOrigin="anonymous" />
            <link
              rel="stylesheet"
              href="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.css"
            />
          </>
        )}
      </head>

      <body className={inter.className}>
        {/* One-time SW + caches flush when BUILD_TAG changes */}
        <Script id="sw-flush" strategy="afterInteractive">
          {`(async()=>{try{
            const tag='${BUILD_TAG}';
            const prev=localStorage.getItem('BUILD_TAG');
            if(prev!==tag){
              if('serviceWorker' in navigator){
                const regs=await navigator.serviceWorker.getRegistrations();
                for(const r of regs){ try{await r.unregister();}catch{} }
              }
              if('caches' in window){
                const keys=await caches.keys();
                for(const k of keys){ try{await caches.delete(k);}catch{} }
              }
              localStorage.setItem('BUILD_TAG', tag);
            }
          }catch(e){console.warn('SW flush failed', e);}})();`}
        </Script>

        <AuthProvider>
          <CartProvider>
            {/* Auto-detect & store currency */}
            <AutoCurrency />

            {/* Site chrome */}
            <Header />
            {children}
            <Footer />
            <LiveChat />
            <Toaster />

            {/* No-JS notice (optional, accessibility) */}
            <noscript>
              <div style={{ padding: 8, textAlign: "center", fontSize: 12 }}>
                JavaScript is required for the best experience on this site.
              </div>
            </noscript>

            {/* Snipcart JS + container (only if key present) */}
            {hasSnipcart && (
              <>
                <Script
                  src="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.js"
                  strategy="afterInteractive"
                />
                <div
                  hidden
                  id="snipcart"
                  data-api-key={snipcartKey}
                  data-config-modal-style="side"
                  data-currency="EUR"
                />
              </>
            )}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
