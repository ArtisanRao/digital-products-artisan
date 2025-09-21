// lib/checkout.ts
export type CheckoutLine = {
  id: string;           // internal id/sku
  name: string;
  price: number;        // in the active currency's minor units handled server-side
  image?: string;
  quantity?: number;
};

export async function startCheckout(lines: CheckoutLine[]) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to start checkout");
  }

  const { url } = (await res.json()) as { url: string };
  window.location.href = url; // ðŸ‘ˆ go straight to Stripeâ€™s hosted checkout
}
