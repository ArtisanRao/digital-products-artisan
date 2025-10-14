"use client";

import { useEffect } from "react";

export default function SwNuke({ version }: { version: string }) {
  useEffect(() => {
    (async () => {
      try {
        const KEY = "SW_NUKE_VERSION";
        const prev = localStorage.getItem(KEY);
        if (prev === version) return;

        const hadController =
          typeof navigator !== "undefined" &&
          navigator.serviceWorker &&
          navigator.serviceWorker.controller;

        // Unregister all SWs
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const r of regs) {
            try {
              await r.unregister();
            } catch {}
          }
        }
        // Clear all caches
        if ("caches" in window) {
          const keys = await caches.keys();
          for (const k of keys) {
            try {
              await caches.delete(k);
            } catch {}
          }
        }

        localStorage.setItem(KEY, version);
        if (hadController) location.reload();
      } catch (e) {
        // best effort; stay silent
        console.warn("SwNuke failed", e);
      }
    })();
  }, [version]);

  return null;
}
