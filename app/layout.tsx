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
        {/* PWA & manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />

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
