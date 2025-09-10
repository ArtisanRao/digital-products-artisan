// app/order-confirmation/page.tsx
import Stripe from "stripe";
import Link from "next/link";
import { products, productsBySlug, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Download } from "lucide-react";
import { signDownloadToken } from "@/lib/download-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = { session_id?: string };

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { session_id } = await searchParams;

  // Friendly empty state if landing here directly
  if (!session_id) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">No order to confirm</h1>
        <p className="text-gray-600">
          We couldn’t find a Stripe session in the URL. If you just purchased,
          please return from the Stripe page or{" "}
          <Link className="underline" href="/products">
            browse products
          </Link>{" "}
          and try again.
        </p>
      </main>
    );
  }

  // Try to read Stripe session server-side
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const downloadSecret = process.env.DOWNLOAD_SECRET;

  let email: string | null = null;
  let items: {
    name: string;
    qty: number;
    unit: number; // USD
    slug?: string;
    image?: string;
    downloadHref?: string;
  }[] = [];
  let currency = "USD";
  let sessionStatus = "complete";

  try {
    if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    email = session.customer_details?.email ?? null;
    sessionStatus = session.status ?? "complete";
    currency = (session.currency || "usd").toUpperCase();

    const lineItems = (session as any).line_items?.data as any[] | undefined;

    if (lineItems?.length) {
      items = lineItems.map((li) => {
        const qty: number = Number(li.quantity ?? 1);
        const desc: string | undefined = li.description;
        const priceProduct = li.price?.product as any | undefined;

        // Try to discover a slug coming from product metadata, else match by title
        const slugFromMeta: string | undefined = priceProduct?.metadata?.slug;
        let local: Product | undefined =
          (slugFromMeta && productsBySlug?.[slugFromMeta]) ||
          products.find((p) => p.title === (desc || priceProduct?.name)) ||
          undefined;

        // Compute a unit price in dollars from Stripe cents
        const subCents: number =
          Number(li.amount_subtotal ?? li.amount_total ?? 0);
        const unit = qty > 0 ? subCents / qty / 100 : 0;

        // Build a signed download link if possible
        let downloadHref: string | undefined;
        if (local && local.downloadPath && downloadSecret) {
          const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
          const token = signDownloadToken(
            { p: local.downloadPath, exp },
            downloadSecret
          );
          downloadHref = `/api/download?token=${encodeURIComponent(token)}`;
        }

        return {
          name: desc || local?.title || "Item",
          qty,
          unit: Number.isFinite(unit) ? unit : 0,
          slug: local?.slug,
          image: local?.images?.[0] ?? local?.image,
          downloadHref,
        };
      });
    }
  } catch (e) {
    // If Stripe read fails, we still render a friendly page
    console.error("order-confirmation: failed to load session", e);
  }

  const total = items.reduce((s, it) => s + it.unit * it.qty, 0);

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Success banner */}
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl md:text-3xl font-bold">
          Payment Successful — Thanks for your purchase!
        </h1>
      </div>

      {/* Order summary text */}
      <p className="text-gray-700 mb-6">
        {email
          ? `We received your order for ${currency} ${total.toFixed(
              2
            )}. A receipt has been sent to ${email}.`
          : `We received your order for ${currency} ${total.toFixed(
              2
            )}. A receipt has been emailed to you.`}
      </p>

      {/* Receipt table */}
      {items.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b">
                  <th className="py-2 pr-3">Item</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Unit</th>
                  <th className="py-2 pr-3">Subtotal</th>
                  <th className="py-2">Download</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        {it.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={it.image.startsWith("http") ? it.image : `${siteUrl}${it.image}`}
                            alt={it.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{it.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">{it.qty}</td>
                    <td className="py-3 pr-3">
                      {currency} {it.unit.toFixed(2)}
                    </td>
                    <td className="py-3 pr-3">
                      {currency} {(it.unit * it.qty).toFixed(2)}
                    </td>
                    <td className="py-3">
                      {it.downloadHref ? (
                        <Button asChild size="sm">
                          <a href={it.downloadHref}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      ) : (
                        <span className="text-gray-500">
                          We’ll email your files shortly
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 font-semibold" colSpan={3}>
                    Total
                  </td>
                  <td className="pt-4 font-semibold">
                    {currency} {total.toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Next actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/library">Go to your library</Link>
        </Button>
      </div>
    </main>
  );
}
