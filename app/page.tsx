'use client'

import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import ProductCategories from "@/components/product-categories"
import AboutSection from "@/components/about-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import FAQSection from "@/components/faq-section"
import LoadingSpinner from "@/components/loading-spinner"
import BackToTopButton from "@/components/BackToTopButton"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import LiveChat from "@/components/live-chat"
import Script from "next/script"

export const metadata = {
  title: "Digital Products Artisan | Premium Digital Downloads",
  description: "Instantly download ebooks, templates, graphics, and more — created for creators.",
  openGraph: {
    title: "Digital Products Artisan",
    description: "Premium digital downloads. Instant access. No fluff.",
    url: "https://digitalproductsartisan.com",
    siteName: "Digital Products Artisan",
    images: [
      { url: "/images/logo.png", width: 1200, height: 630, alt: "Digital Products Artisan" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description: "High-quality digital downloads at your fingertips.",
    images: ["/images/logo.png"],
  },
}

export default function HomePage() {
  return (
    <AuthProvider>
      <CartProvider>
        <main className="min-h-screen">
          {/* Set exact spacing of 1cm between header and hero */}
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
          <LiveChat />
          <Toaster />

          {/* Snipcart container */}
          <div
            hidden
            id="snipcart"
            data-api-key={process.env.NEXT_PUBLIC_SNIPCART_API_KEY}
            data-config-modal-style="side"
          ></div>

          {/* Snipcart Loader Script */}
          <Script id="snipcart-loader" strategy="beforeInteractive">
            {`
              window.SnipcartSettings = {
                publicApiKey: '${process.env.NEXT_PUBLIC_SNIPCART_API_KEY}',
                loadStrategy: 'on-user-interaction',
              };
              (()=>{var c,d;(d=(c=window.SnipcartSettings).version)!=null||(c.version="3.0");var s,S;(S=(s=window.SnipcartSettings).timeoutDuration)!=null||(s.timeoutDuration=2750);var l,p;(p=(l=window.SnipcartSettings).domain)!=null||(l.domain="cdn.snipcart.com");var w,u;(u=(w=window.SnipcartSettings).protocol)!=null||(w.protocol="https");var f=window.SnipcartSettings.version.includes("v3.0.0-ci")||window.SnipcartSettings.version!="3.0"&&window.SnipcartSettings.version.localeCompare("3.4.0",void 0,{numeric:!0,sensitivity:"base"})===-1,m=["focus","mouseover","touchmove","scroll","keydown"];window.LoadSnipcart=o;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r();function r(){window.SnipcartSettings.loadStrategy?window.SnipcartSettings.loadStrategy==="on-user-interaction"&&(m.forEach(t=>document.addEventListener(t,o)),setTimeout(o,window.SnipcartSettings.timeoutDuration)):o()}var a=!1;function o(){if(a)return;a=!0;let t=document.getElementsByTagName("head")[0],e=document.querySelector("#snipcart"),i=document.querySelector(\`src[src^="\${window.SnipcartSettings.protocol}://\${window.SnipcartSettings.domain}"][src$="snipcart.js"]\`),n=document.querySelector(\`link[href^="\${window.SnipcartSettings.protocol}://\${window.SnipcartSettings.domain}"][href$="snipcart.css"]\`);e||(e=document.createElement("div"),e.id="snipcart",e.setAttribute("hidden","true"),document.body.appendChild(e)),v(e),i||(i=document.createElement("script"),i.src=\`\${window.SnipcartSettings.protocol}://\${window.SnipcartSettings.domain}/themes/v\${window.SnipcartSettings.version}/default/snipcart.js\`,i.async=!0,t.appendChild(i)),n||(n=document.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=\`\${window.SnipcartSettings.protocol}://\${window.SnipcartSettings.domain}/themes/v\${window.SnipcartSettings.version}/default/snipcart.css\`,t.prepend(n)),m.forEach(g=>document.removeEventListener(g,o))}function v(t){!f||(t.dataset.apiKey=window.SnipcartSettings.publicApiKey,window.SnipcartSettings.addProductBehavior&&(t.dataset.configAddProductBehavior=window.SnipcartSettings.addProductBehavior),window.SnipcartSettings.modalStyle&&(t.dataset.configModalStyle=window.SnipcartSettings.modalStyle),window.SnipcartSettings.currency&&(t.dataset.currency=window.SnipcartSettings.currency),window.SnipcartSettings.templatesUrl&&(t.dataset.templatesUrl=window.SnipcartSettings.templatesUrl))}})();
            `}
          </Script>

          {/* Debug ENV */}
          <Script id="env-checks" strategy="afterInteractive">
            {`
              console.log("ENV SUPABASE URL:", "${process.env.NEXT_PUBLIC_SUPABASE_URL}");
              console.log("ENV SUPABASE KEY:", "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Loaded" : "Missing"}");
              console.log("ENV SNIPCART API KEY:", "${process.env.NEXT_PUBLIC_SNIPCART_API_KEY ? "Loaded" : "Missing"}");
            `}
          </Script>
        </main>
      </CartProvider>
    </AuthProvider>
  )
}
