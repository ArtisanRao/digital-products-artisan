"use client";

import { useEffect } from "react";

interface SnipcartLoaderClientProps {
  apiKey: string;
}

export default function SnipcartLoaderClient({ apiKey }: SnipcartLoaderClientProps) {
  useEffect(() => {
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
      container.setAttribute("data-api-key", apiKey);
      container.setAttribute("hidden", "true");
      document.body.appendChild(container);
    }
  }, [apiKey]);

  return null;
}
