import React from "react"

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What is Digital Products Artisan?</h2>
        <p className="text-gray-700">
          Digital Products Artisan is a curated marketplace for premium digital goods—ebooks, AI prompts & packs, templates, graphics, planners, and productivity assets. Whether you're a creator, entrepreneur, building a brand, managing a project, boosting creativity or a lifelong learner, we offer the tools you need to bring your vision to life—all delivered instantly and effortlessly, with no fluff.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Are your digital products compatible with my software?</h3>
          <p className="text-gray-700">
            Most of our products come in widely supported formats like PDF, PSD, PNG, DOCX, and more. Product pages include compatibility details — always check there first.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Can I customize the templates I purchase?</h3>
          <p className="text-gray-700">
            Yes! Many of our templates are fully editable using common software like Microsoft Office, Google Docs, Adobe tools, or Canva (if stated). Customization instructions are usually included.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Is there a limit to how many times I can download my purchase?</h3>
          <p className="text-gray-700">
            No, once you've purchased a product, the download link is yours to use at any time. If the link expires or is lost, just contact us.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">How long will my download link be active?</h3>
          <p className="text-gray-700">
            Download links are typically active for at least 7 days after purchase. However, we’re happy to reactivate or resend it if needed.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Do I need an account to purchase or download?</h3>
          <p className="text-gray-700">
            No account is required to make a purchase, but creating one allows you to track orders and easily access your downloads anytime.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Can I get an invoice or receipt?</h3>
          <p className="text-gray-700">
            Yes, a receipt is automatically emailed to you after purchase. If you need a business invoice, contact support with your billing details.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Do you offer bulk or business licensing?</h3>
          <p className="text-gray-700">
            We offer commercial licenses for most products and can arrange bulk or extended licensing for teams. Contact us with your request.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">I found a bug or issue with a file. What should I do?</h3>
          <p className="text-gray-700">
            Please contact us immediately with details and a screenshot if possible. We’ll replace, update, or assist you as quickly as possible.
          </p>
        </div>
      </div>
    </div>
  )
}
