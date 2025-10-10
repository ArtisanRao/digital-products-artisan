// app/layout.tsx
import type { Metadata, Viewport } from "next";
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
import ClickDelegator from "@/components/debug/ClickDelegator"; // 👈 mount global capture-phase click handler

const inter = Inter({ subsets: ["latin"], display: "swap" });

/** Global site metadata (fixes the metadataBase warning) */
export const metadata: Metadata = {
  metadataBase: new URL("https://digitalproductsartisan.com"),
  title: {
    default: "Digital Products Artisan",
    template: "%s | Digital Products Artisan",
  },
  description:
    "Premium handcrafted digital downloads for creators and entrepreneurs.",
  openGraph: {
    type: "website",
    url: "https://digitalproductsartisan.com",
    title: "Digital Products Artisan",
    description:
      "Premium handcrafted digital downloads for creators and entrepreneurs.",
    images: ["/images/logo-new.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description:
      "Premium handcrafted digital downloads for creators and entrepreneurs.",
    images: ["/images/logo-new.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-48x48.png", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96" },
      { url: "/web-app-manifest-192x192.png", sizes: "192x192" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

/** Bump this on each deploy to force clients to unregister old SW and clear caches */
const BUILD_TAG = "sw-flush-2025-09-26-k";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;
  const hasSnipcart = !!snipcartKey;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Build/debug marker so you can confirm the new layout is live */}
        <meta name="x-build-tag" content={BUILD_TAG} />

        {/* JSON-LD (Organization) */}
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

      <body className={inter.className} data-ui-build={BUILD_TAG}>
        {/* One-time SW + caches flush when BUILD_TAG changes (kept for safety) */}
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
            <AutoCurrency />

            <Header />
            {children}
            <Footer />
            <LiveChat />
            <Toaster />

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

        {/* 👇 capture-phase click delegator to force navigation to nearest <a> */}
        <ClickDelegator />
      </body>
    </html>
  );
}
