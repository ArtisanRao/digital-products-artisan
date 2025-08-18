"use client";

import { useEffect } from "react";

export default function SnipcartLoaderClient() {
  useEffect(() => {
    // Create the Snipcart container div if it doesn't exist
    if (!document.getElementById("snipcart")) {
      const snipcartDiv = document.createElement("div");
      snipcartDiv.id = "snipcart";
      snipcartDiv.setAttribute(
        "data-api-key",
        "ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4"
      ); // <-- your live public API key
      snipcartDiv.hidden = true;
      document.body.appendChild(snipcartDiv);
    }

    // Load Snipcart script dynamically if not already loaded
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
