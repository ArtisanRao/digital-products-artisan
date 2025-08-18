"use client";

import { useEffect } from "react";

interface SnipcartLoaderClientProps {
  apiKey: string;
}

// Extend Window interface
declare global {
  interface Window {
    SnipcartSettings?: {
      publicApiKey: string;
      loadStrategy?: "immediate" | "on-user-interaction";
    };
  }
}

export default function SnipcartLoaderClient({ apiKey }: SnipcartLoaderClientProps) {
  useEffect(() => {
    // Ensure SnipcartSettings exists before script loads
    if (!window.SnipcartSettings) {
      window.SnipcartSettings = {
        publicApiKey: apiKey,
        loadStrategy: "on-user-interaction", // optional: "on-user-interaction" or "immediate"
      };
    }

    // Inject Snipcart script
    const existingScript = document.getElementById("snipcart-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "snipcart-js";
      script.src = "https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Inject Snipcart container
    let container = document.getElementById("snipcart");
    if (!container) {
      container = document.createElement("div");
      container.id = "snipcart";
      container.setAttribute("hidden", "true");
      document.body.appendChild(container);
    }
  }, [apiKey]);

  return null;
}
