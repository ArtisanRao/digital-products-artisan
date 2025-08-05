export const metadata = {
  title: "Privacy Policy | Digital Products Artisan",
  description: "Learn how we handle your data and protect your privacy when you shop with us.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">🔒 Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        At Digital Products Artisan, we value your privacy and are committed to protecting your personal information.
        This Privacy Policy outlines how we collect, use, and safeguard your data.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Your name and email address when placing an order</li>
        <li>Billing information (securely handled by Snipcart)</li>
        <li>Any messages or support requests you send</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <p className="text-gray-700">
        We use your information only to process your orders, send digital downloads, and provide customer support.
        We never sell or share your data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Security</h2>
      <p className="text-gray-700">
        Your data is stored securely and encrypted when necessary. Payment information is handled by trusted third-party
        processors like Snipcart and is never stored on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Contact Us</h2>
      <p className="text-gray-700">
        If you have any questions about this Privacy Policy, you can reach us via our{" "}
        <a href="/contact" className="text-blue-600 underline">Contact Page</a>.
      </p>
    </main>
  )
}
