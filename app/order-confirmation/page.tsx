// app/order-confirmation/page.tsx
import Stripe from "stripe";
import Link from "next/link";
import crypto from "crypto";
import { Button } from "@/components/ui/button";
import { productsById, productsBySlug, products } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = { session_id?: string };

function formatAmount(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

// url-safe base64
function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signDownloadToken(payload: { p: string; exp: number }, secret: string) {
  const data = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret).update(data).digest());
  return `${data}.${sig}`;
}

// very small slugifier for fallback name matching
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ReceiptRow = {
  name: string;
  qty: number;
  unit: number;        // cents
  lineTotal: number;   // cents
  currency: string;
  downloadHref?: string;
  note?: string;       // if we couldn't resolve a local file
};

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-2">Missing session</h1>
        <p className="text-gray-600">
          We couldn’t find your checkout session.{" "}
          <Link href="/products" className="underline">Back to products</Link>.
        </p>
      </main>
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Pull everything we need in one call
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items.data.price.product"],
  });

  const email = session.customer_details?.email ?? "";
  const currency = session.currency ?? "usd";
  const lineItems = session.line_items?.data ?? [];

  // Prepare one row per item
  const secret = process.env.DOWNLOAD_SECRET;
  const rows: ReceiptRow[] = [];

  for (const li of lineItems) {
    const qty = li.quantity ?? 1;
    const unit = li.price?.unit_amount ?? 0;
    const lineTotal = li.amount_total ?? unit * qty;
    const productObj = li.price?.product as Stripe.Product | undefined;
    const name =
      productObj?.name || li.description || "Item";

    let downloadHref: string | undefined;
    let note: string | undefined;

    // Try to resolve the local product for this line
    // Priority: product.metadata.slug / productId -> price.metadata -> name slug fallback
    const pMeta = productObj?.metadata ?? {};
    const priceMeta = li.price?.metadata ?? {};

    const slug =
      (pMeta.slug as string | undefined) ||
      (priceMeta.slug as string | undefined);

    const pidStr =
      (pMeta.productId as string | undefined) ||
      (priceMeta.productId as string | undefined);

    let local =
      (slug && productsBySlug[slug]) ||
      (pidStr && productsById[Number(pidStr)]);

    if (!local && name) {
      const guessed = productsBySlug[slugify(name)];
      if (guessed) local = guessed;
    }

    if (local?.downloadPath && secret) {
      const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      const token = signDownloadToken({ p: local.downloadPath, exp }, secret);
      downloadHref = `/api/download?token=${encodeURIComponent(token)}`;
    } else if (!local) {
      note = "We couldn't find a matching file in your catalog (check slug/productId metadata).";
    } else if (!secret) {
      note = "DOWNLOAD_SECRET is not set; cannot generate secure links.";
    }

    rows.push({
      name,
      qty,
      unit,
      lineTotal,
      currency,
      downloadHref,
      note,
    });
  }

  const grandTotal =
    session.amount_total ??
    rows.reduce((acc, r) => acc + r.lineTotal, 0);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* success header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 7L9 18l-5-5"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold mb-2">Payment successful</h1>
          <p className="text-gray-700">
            Thank you! Your order is confirmed
            {email ? <>. A receipt has been sent to <strong>{email}</strong>.</> : "."}
          </p>
        </div>

        {/* mini receipt */}
        <div className="mt-10 overflow-x-auto rounded-xl border">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Qty</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Unit</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium">{r.name}</div>
                    {r.note ? (
                      <div className="text-xs text-amber-600 mt-1">{r.note}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">{r.qty}</td>
                  <td className="px-4 py-3 text-right">{formatAmount(r.unit, r.currency)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatAmount(r.lineTotal, r.currency)}</td>
                  <td className="px-4 py-3 text-right">
                    {r.downloadHref ? (
                      <a
                        className="inline-flex text-sm font-medium text-blue-600 hover:underline"
                        href={r.downloadHref}
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-right font-semibold" colSpan={3}>
                  Order total
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatAmount(grandTotal || 0, currency)}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-3 text-sm text-gray-500 text-center">
          Each secure link works for <strong>7 days</strong>. Keep the email receipt for your records.
        </p>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
