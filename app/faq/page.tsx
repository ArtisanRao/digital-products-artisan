// app/faq/page.tsx

export const metadata = {
  title: "FAQs | Digital Products Artisan",
  description: "Find answers to frequently asked questions about our digital products, downloads, and support.",
}

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold">What is Digital Products Artisan?</h2>
          <p>
            Digital Products Artisan is your one-stop shop for high-quality digital downloads including ebooks,
            templates, graphics, and productivity tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How will I receive my purchase?</h2>
          <p>
            Immediately after completing your payment, you’ll receive a secure download link via email. You can also
            download your files directly from the checkout confirmation page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Can I use the products for commercial projects?</h2>
          <p>
            Yes! Unless otherwise stated, our products come with a license that allows both personal and limited
            commercial use. Please refer to the specific product page for exact licensing terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">I didn’t receive my download. What should I do?</h2>
          <p>
            Please check your spam or junk folder first. If you still don’t see the email, contact us at
            <a href="mailto:support@digitalproductsartisan.com" className="text-blue-600 underline">
              {" "}
              support@digitalproductsartisan.com
            </a>{" "}
            and we’ll resend your files.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Do you offer refunds?</h2>
          <p>
            Because our products are digital and instantly delivered, we generally do not offer refunds. However, if you
            experience issues, please contact us and we’ll do our best to help. See our{" "}
            <a href="/returns" className="text-blue-600 underline">
              Returns Policy
            </a>{" "}
            for more details.
          </p>
        </section>
      </div>
    </main>
  )
}
