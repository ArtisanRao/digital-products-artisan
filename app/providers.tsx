"use client";

import React from "react";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LiveChat from "@/components/live-chat";
import AutoCurrency from "@/components/auto-currency";
import Script from "next/script";

export default function Providers({ children }: { children: React.ReactNode }) {
  const snipcartKey = process.env.NEXT_PUBLIC_SNIPCART_KEY;
  const hasSnipcart = !!snipcartKey;

  return (
    <AuthProvider>
      <CartProvider>
        <AutoCurrency />
        {children}
        <LiveChat />
        <Toaster />

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
  );
}
