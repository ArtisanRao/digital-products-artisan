'use client';

import { useEffect } from "react";

export default function SnipcartLoaderClient() {
  useEffect(() => {
    // Inject Snipcart script
    const script = document.createElement("script");
    script.src = "https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Snipcart container
  return (
    <div
      hidden
      id="snipcart"
      data-api-key="ZDgyODMyODgtMzdhZC00ZTI0LTkzZTUtYjRhMTM0MDg4ODM2NjM4ODg4NTc5NTI0NTk5MjQ4"
      data-config-modal-style="side"
    ></div>
  );
}
