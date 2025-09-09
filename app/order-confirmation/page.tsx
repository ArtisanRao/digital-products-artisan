// app/order-confirmation/page.tsx
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Stripe from "stripe"
import { headers } from "next/headers"
import { products } from "@/data/products"
import { signDownloadToken } from "@/lib/download-token"

export const dynamic = "force-dynamic"

type Search = { session_id?: string }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

export default async function OrderConfirmation({ searchParams }: { searchParams: Promise<Search> }) {
  const { session_id } = await searchParams
  if (!session_id) return notFound()

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent.latest_charge"],
    })
  } catch {
    return notFound()
  }

  const email = session.customer_details?.email ?? ""
  const amount = (session.amount_total ?? 0) / 100
  const currency = (session.currency ?? "usd").toUpperCase()

  const productId = Number(session.metadata?.productId)
  const product = products.find((p) => p.id === productId)
  if (!product) return notFound()

  const h = headers()
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${h.get("x-forwarded-proto") || "http"}://${h.get("host")}`

  const token = signDownloadToken({ pid: product.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  const downloadUrl = `${baseUrl}/api/download?token=${token}`

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-600">
            <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">Payment successful</h1>
        <p className="text-gray-600">
          {email ? <>Thanks, <span className="font-medium">{email}</span>! </> : null}
          Your order is confirmed.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 items-start">
          <div className="rounded-lg border p-4 bg-white">
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
            <h2 className="mt-4 text-left font-semibold">{product.title}</h2>
            <p className="text-left text-sm text-gray-600">{product.category}</p>
          </div>

          <div className="rounded-lg border p-6 text-left bg-white">
            <h3 className="font-semibold mb-3">Order summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Amount paid</dt>
                <dd className="font-medium">
                  {currency} {amount.toFixed(2)}
                </dd>
              </div>
              {email ? (
                <div className="flex justify-between">
                  <dt>Receipt sent to</dt>
                  <dd className="font-medium">{email}</dd>
                </div>
              ) : null}
            </dl>

            <a
              href={downloadUrl}
              className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Download your files
            </a>

            <div className="mt-4 text-xs text-gray-500">
              You’ll also receive this link by email. It remains valid for 7 days.
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
