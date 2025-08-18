"use client";

import { useEffect } from "react";

interface SnipcartLoaderClientProps {
  apiKey: string;
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

    // Inject Snipcart container if not present
    let container = document.getElementById("snipcart");
    if (!container) {
      container = document.createElement("div");
      container.id = "snipcart";
      container.setAttribute("hidden", "true");
      document.body.appendChild(container);
    }

    // Inject Snipcart script if not already added
    if (!document.getElementById("snipcart-js")) {
      const script = document.createElement("script");
      script.id = "snipcart-js";
      script.src = "https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [apiKey]);

  return null;
}
