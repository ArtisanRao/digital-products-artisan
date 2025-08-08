import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // ✅ Fixed casing
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Products Artisan",
  description:
    "Premium planners, templates, and digital tools designed to elevate your productivity and creativity. Instant access. Unlimited possibilities.",
  keywords:
    "digital downloads, productivity planners, templates, digital tools, notion templates, printable PDFs, digital shop",
  authors: [{ name: "Digital Products Artisan" }],
  openGraph: {
    title: "Digital Products Artisan",
    description:
      "Curated digital resources for creators and entrepreneurs—planners, templates, and tools to help you thrive.",
    type: "website",
    locale: "en_US",
    url: "https://digitalproductsartisan.com",
    siteName: "Digital Products Artisan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Products Artisan",
    description: "Tools and templates for creators, entrepreneurs, and doers.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon1.png", sizes: "192x192", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Digital Products Artisan",
    statusBarStyle: "black-translucent",
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
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />

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
            {children}
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
