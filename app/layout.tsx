import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InnovateSphere - Digital Solutions for Tomorrow's World",
  description:
    "Discover cutting-edge digital solutions—software, templates, and resources to power your innovation. Instant access, limitless potential.",
  keywords:
    "digital solutions, software, templates, AI tools, digital downloads, innovation resources",
  authors: [{ name: "InnovateSphere" }],
  openGraph: {
    title: "InnovateSphere - Digital Solutions",
    description:
      "Empowering innovation with a curated collection of digital tools for creators and entrepreneurs.",
    type: "website",
    locale: "en_US",
    url: "https://digitalproductsartisan.com",
    siteName: "InnovateSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "InnovateSphere",
    description: "Digital solutions for creators and entrepreneurs",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon1.png", sizes: "192x192", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA / Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="InnovateSphere" />
        <meta name="apple-mobile-web-app-title" content="InnovateSphere" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
