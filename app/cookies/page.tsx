export const metadata = {
  title: "Cookie Policy | Digital Products Artisan",
  description: "How we use cookies and similar technologies to improve your experience.",
}

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">🍪 Cookie Policy</h1>

      <p className="text-gray-700 mb-6">
        This Cookie Policy explains how <strong>Digital Products Artisan</strong> uses cookies and similar technologies
        when you visit our website at <a href="https://digitalproductsartisan.com" className="text-blue-600 underline">digitalproductsartisan.com</a>.
      </p>

      <h2 className="text-xl font-semibold mb-3">1. What are Cookies?</h2>
      <p className="text-gray-700 mb-4">
        Cookies are small text files that are stored on your device to help improve your browsing experience.
        They allow us to remember your preferences and understand how you interact with our site.
      </p>

      <h2 className="text-xl font-semibold mb-3">2. How We Use Cookies</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        <li>To enable shopping cart functionality via Snipcart</li>
        <li>To analyze traffic and improve performance (via tools like Google Analytics)</li>
        <li>To remember user preferences like theme or language</li>
      </ul>

      <h2 className="text-xl font-semibold mb-3">3. Managing Cookies</h2>
      <p className="text-gray-700 mb-4">
        You can control cookies through your browser settings. Disabling cookies may impact your experience,
        especially in the checkout or login process.
      </p>

      <h2 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
      <p className="text-gray-700 mb-4">
        Some cookies may be set by third-party services like Snipcart or analytics providers.
        We do not control these cookies directly.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  )
}
