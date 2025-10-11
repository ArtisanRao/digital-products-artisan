// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
// import LiveChat from "@/components/live-chat"; // ⛔️ TEMP: disable to rule out overlay
import AutoCurrency from "@/components/auto-currency";
import Script from "next/script";
import React from "react";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalproductsartisan.com"),
  title: { default: "Digital Products Artisan", template: "%s | Digital Products Artisan" },
  description: "Premium handcrafted digital downloads for creators and entrepreneurs.",
  openGraph: {
    type: "website",
    url: "https://digitalproductsartisan.com",
    title: "Digital Products Artisan",
    description: "Premium handcrafted digital downloads for creators and entrepreneurs.",
    images: ["/images/logo-new.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description: "Premium handcrafted digital downloads for creators and entrepreneurs.",
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

/** Bump on each deploy to flush old SW & caches */
const BUILD_TAG = "sw-flush-restore-01";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;
  const hasSnipcart = !!snipcartKey;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="x-build-tag" content={BUILD_TAG} />

        {/* Force base clarity in case a style left global blur/opacity */}
        <style>{`
          html, body, main { opacity: 1 !important; filter: none !important; backdrop-filter: none !important; }
          body { pointer-events: auto !important; }
        `}</style>

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

        {/* Snipcart CSS only if key present */}
        {hasSnipcart && (
          <>
            <link rel="preconnect" href="https://app.snipcart.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://cdn.snipcart.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.css" />
          </>
        )}
      </head>

      <body className={inter.className} data-ui-build={BUILD_TAG}>
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
            <AutoCurrency />
            <Header />
            {children}
            <Footer />
            {/* <LiveChat />  ⛔️ TEMP: disabled to eliminate overlay as cause */}
            <Toaster />

            <noscript>
              <div style={{ padding: 8, textAlign: "center", fontSize: 12 }}>
                JavaScript is required for the best experience on this site.
              </div>
            </noscript>

            {/* Snipcart JS only if key present */}
            {hasSnipcart && (
              <>
                <Script src="https://cdn.snipcart.com/themes/v3.6.0/default/snipcart.js" strategy="afterInteractive" />
                <div hidden id="snipcart" data-api-key={snipcartKey} data-config-modal-style="side" data-currency="EUR" />
              </>
            )}
          </CartProvider>
        </AuthProvider>

        {/* 🔧 Overlay killer: neutralize any full-viewport, non-interactive blocker */}
        <Script id="overlay-killer" strategy="afterInteractive">
          {`
(function(){
  function isBig(el){
    try{
      var r = el.getBoundingClientRect();
      return r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.2;
    }catch(e){ return false; }
  }
  function isBlocker(el){
    if(!el || el.tagName==='A' || el.tagName==='BUTTON' || el.closest('a,button')) return false;
    var cs = getComputedStyle(el);
    if(cs.pointerEvents === 'none') return false;
    var z = parseInt(cs.zIndex || '0', 10);
    var pos = cs.position;
    var op = parseFloat(cs.opacity || '1');
    var hasBg = (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)');
    return (pos === 'fixed' || pos === 'absolute') && (z >= 10) && (op < 1 || hasBg) && isBig(el);
  }
  function neuter(el){
    el.setAttribute('data-overlay-neutralized','1');
    el.style.pointerEvents = 'none';
    el.style.zIndex = '-1';
  }
  function sweep(){
    // look at center and corners
    var probe = [
      [innerWidth/2, innerHeight/2],
      [16,16],
      [innerWidth-16, 16],
      [16, innerHeight-16],
      [innerWidth-16, innerHeight-16]
    ];
    for(var i=0;i<probe.length;i++){
      var stack = document.elementsFromPoint(probe[i][0], probe[i][1]) || [];
      for(var j=0;j<stack.length;j++){
        var el = stack[j];
        if(el && el !== document.documentElement && el !== document.body && isBlocker(el)){
          neuter(el);
        }
      }
    }
  }
  // run a few times on load and on route changes
  var runs = 0;
  var timer = setInterval(function(){ sweep(); if(++runs>20) clearInterval(timer); }, 250);
  window.addEventListener('resize', sweep, {passive:true});
  document.addEventListener('visibilitychange', sweep);
})();
          `}
        </Script>
      </body>
    </html>
  );
}
