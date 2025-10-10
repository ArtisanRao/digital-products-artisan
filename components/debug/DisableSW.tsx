"use client";
import { useEffect } from "react";

export default function DisableSW() {
  useEffect(() => {
    (async () => {
      try {
        const regs = await navigator.serviceWorker?.getRegistrations?.();
        regs?.forEach(r => r.unregister());
        const keys = await caches?.keys?.();
        keys?.forEach(k => caches.delete(k));
        // soft refresh after unregister
        // setTimeout(() => location.reload(), 50);
      } catch {}
    })();
  }, []);
  return null;
}
