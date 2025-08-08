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
        {/* Web manifest and PWA */}
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

        {/* Snipcart stylesheet */}
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.css"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {/* Added consistent space below header */}
            <main className="mt-1cm">
              {children}
            </main>
            <Footer />
            <LiveChat />
            <Toaster />

            {/* Snipcart script and config */}
            <script
              async
              src="https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js"
            ></script>
            <div
              hidden
              id="snipcart"
              data-api-key="ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4"
              data-config-modal-style="side"
            ></div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
