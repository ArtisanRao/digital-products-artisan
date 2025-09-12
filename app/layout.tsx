'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import LiveChat from '@/components/live-chat';
import CurrencyBootstrap from '@/components/currency-bootstrap';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Digital Products Artisan</title>

        {/* ✅ Make mobile render at device width */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no"
        />

        <meta
          name="description"
          content="Premium handcrafted digital downloads for creators and entrepreneurs."
        />

        {/* PWA / icons */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="Digital Products Artisan" />
        <meta name="apple-mobile-web-app-title" content="Digital Products Artisan" />

        {/* FAVICONS — use assets in /public */}
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
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Digital Products Artisan',
              url: 'https://digitalproductsartisan.com',
              logo: 'https://digitalproductsartisan.com/images/logo-new.png',
            }),
          }}
        />
        {/* Snipcart assets removed; Stripe handles checkout */}
      </head>

      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            {/* Invisible currency auto-detect (no visible picker) */}
            <CurrencyBootstrap />

            <Header />
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
