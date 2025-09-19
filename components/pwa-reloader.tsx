"use client";

import { useEffect } from "react";

export default function PwaReloader() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // When the new SW takes control of the page, reload once to pick up fresh assets
    const onControllerChange = () => {
      // Avoid loops: only reload once per take-over
      if (!sessionStorage.getItem("__sw_reloaded")) {
        sessionStorage.setItem("__sw_reloaded", "1");
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return null;
}
