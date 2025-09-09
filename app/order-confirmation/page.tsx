// app/order-confirmation/page.tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { Button } from "@/components/ui/button"
import { signDownloadToken } from "@/lib/download-token"

export const dynamic = "force-dynamic"

type Search = { session_id?: string }

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    // Guard so we fail only at request time if misconfigured
    throw new Error("Missing STRIPE_SECRET_KEY")
  }
  // No apiVersion here -> fixes the type error during build
  return new Stripe(key)
}

export default async function OrderConfirmation({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const { session_id } = await searchParams
  if (!session_id) return notFound()

  let productId: number | undefined
  let slug: string | undefined
  let amountTotal: number | null = null
  let currency: string | null = null

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    })
    productId = session.metadata?.productId ? Number(session.metadata.productId) : undefined
    slug = session.metadata?.slug ?? undefined
    amountTotal = session.amount_total
    currency = session.currency
  } catch (e) {
    // Render a friendly fallback if the session lookup fails
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Order confirmation</h1>
        <p className="text-gray-700 mb-6">
          We received your order, but we couldn’t load the Stripe session details just now.
          If you paid successfully, you’ll also receive a download link by email.
        </p>
        <div className="flex gap-3">
          <Button asChild><Link href="/products">Continue shopping</Link></Button>
          <Button asChild variant="outline"><Link href="/">Go home</Link></Button>
        </div>
      </main>
    )
  }

  // Build a 7-day download link if we have the productId
  const token =
    typeof productId === "number"
      ? signDownloadToken({ pid: productId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
      : null
  const downloadHref = token ? `/api/download?token=${token}` : null

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Thank you—your order is confirmed!</h1>
      <p className="text-gray-700 mb-6">
        We’ve also emailed your receipt and download link. Save this page for your records.
      </p>

      <div className="mb-6 text-sm text-gray-600 space-y-1">
        {amountTotal !== null && currency ? (
          <div>
            <span className="font-medium">Total paid: </span>
            <span>
              {(amountTotal / 100).toLocaleString(undefined, {
                style: "currency",
                currency: currency.toUpperCase(),
              })}
            </span>
          </div>
        ) : null}
        <div><span className="font-medium">Stripe session:</span> {session_id}</div>
        {typeof productId === "number" && (
          <div><span className="font-medium">Product ID:</span> {productId}</div>
        )}
        {slug && (
          <div><span className="font-medium">Product slug:</span> {slug}</div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {downloadHref && (
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Link href={downloadHref}>Download now</Link>
          </Button>
        )}
        {typeof productId === "number" && (
          <Button asChild variant="outline">
            <Link href={`/products/${productId}`}>View product</Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  )
}
