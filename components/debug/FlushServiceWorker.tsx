"use client";

import { useEffect } from "react";

export default function FlushServiceWorker({
  reason = "temp-disable-pwa-2025-10-10",
}: { reason?: string }) {
  useEffect(() => {
    (async () => {
      try {
        // Unregister any service workers
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const r of regs) {
            await r.unregister();
          }
        }
        // Clear all caches created by workbox/next-pwa
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        // Mark + light cache-bust param (once) to avoid SW scope races
        document.documentElement.dataset.swFlushed = reason;
        const url = new URL(window.location.href);
        if (!url.searchParams.has("no-sw")) {
          url.searchParams.set("no-sw", Date.now().toString());
          history.replaceState(null, "", url.toString());
        }
        console.log("[SW] flushed:", reason);
      } catch (err) {
        console.warn("[SW] flush error", err);
      }
    })();
  }, [reason]);

  return null;
}
