// app/returns/page.tsx

export const metadata = {
  title: "Returns & Refund Policy | Digital Products Artisan",
  description: "Read our refund and return policy for digital downloads.",
}

export default function ReturnsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Returns & Refund Policy</h1>

      <div className="space-y-6 text-base leading-relaxed">
        <p>
          At Digital Products Artisan, your satisfaction is our priority. Since our products are digital and delivered
          instantly, we do not offer traditional returns.
        </p>

        <h2 className="text-xl font-semibold mt-8">Refunds</h2>
        <p>
          All sales are final. We do not offer refunds for change of mind or accidental purchases. However, if you are
          experiencing a technical issue with your download, please contact us and we will do our best to resolve the
          problem quickly.
        </p>

        <h2 className="text-xl font-semibold mt-8">Incorrect or Corrupted Files</h2>
        <p>
          If you receive the wrong file or your download is corrupted, contact us within 7 days of purchase and we’ll
          replace it free of charge.
        </p>

        <h2 className="text-xl font-semibold mt-8">Need Help?</h2>
        <p>
          Reach out to us at{" "}
          <a href="mailto:support@digitalproductsartisan.com" className="text-blue-600 underline">
            support@digitalproductsartisan.com
          </a>{" "}
          and include your order number and a description of the issue. We’re here to help!
        </p>
      </div>
    </main>
  )
}
