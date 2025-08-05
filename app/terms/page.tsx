export const metadata = {
  title: "Terms & Conditions | Digital Products Artisan",
  description: "Please review our terms of service for using this site and purchasing digital products.",
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">📄 Terms & Conditions</h1>

      <p className="text-gray-700 mb-6">
        By accessing or purchasing from <strong>Digital Products Artisan</strong>, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mb-3">1. Digital Product Use</h2>
      <p className="text-gray-700 mb-4">
        All downloads are licensed for personal or commercial use as described on each product page. Redistribution,
        resale, or unauthorized sharing is strictly prohibited.
      </p>

      <h2 className="text-xl font-semibold mb-3">2. Payment & Delivery</h2>
      <p className="text-gray-700 mb-4">
        Payments are securely processed via Snipcart. Upon successful payment, a download link will be delivered to your email.
        Ensure the email address is correct at checkout.
      </p>

      <h2 className="text-xl font-semibold mb-3">3. Refund Policy</h2>
      <p className="text-gray-700 mb-4">
        Due to the digital nature of our products, all sales are final. However, if you encounter any issue with your download,
        contact us and we’ll do our best to help.
      </p>

      <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
      <p className="text-gray-700 mb-4">
        All content and products are copyright © {new Date().getFullYear()} Digital Products Artisan unless otherwise stated.
        You may not copy, alter, or redistribute any content without permission.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Questions? Contact us via our <a href="/contact" className="text-blue-600 underline">Contact Page</a>.
      </p>
    </main>
  )
}
