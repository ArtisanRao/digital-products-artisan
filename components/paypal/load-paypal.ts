"use client";

let loadPromise: Promise<void> | null = null;

export function loadPayPalSDK(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).paypal) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) {
    console.error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID");
    return Promise.reject(new Error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID"));
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }
    const s = document.createElement("script");
    s.id = "paypal-sdk";
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=buttons&intent=capture&currency=USD`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });

  return loadPromise;
}
