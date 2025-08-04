import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
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
  keywords: "digital solutions, software, templates, AI tools, digital downloads, innovation resources",
  authors: [{ name: "InnovateSphere" }],
  openGraph: {
    title: "InnovateSphere - Digital Solutions",
    description: "Empowering innovation with a curated collection of digital tools for creators and entrepreneurs.",
    type: "website",
    locale: "en_US",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Snipcart style */}
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css"
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

            {/* Snipcart script + API key integration */}
            <script
              async
              src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js"
            ></script>
            <div
              hidden
              id="snipcart"
              data-api-key="ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4"
            ></div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
