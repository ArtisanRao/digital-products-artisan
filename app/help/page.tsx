export const metadata = {
  title: "Support Center | Digital Products Artisan",
  description: "Get help with orders, downloads, and troubleshooting.",
}

export default function HelpCenterPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">🛠️ Help Center</h1>
      <p className="text-gray-700 mb-6">
        Welcome to the Digital Products Artisan Support Center. Browse FAQs or reach out if you need help.
      </p>

      <ul className="text-gray-700 space-y-4 list-disc pl-6">
        <li>❓ <strong>Where's my download?</strong> – Check your email for a Snipcart receipt and download link.</li>
        <li>💳 <strong>Payment issues?</strong> – Contact your bank or reach us at <a href="mailto:support@digitalproductsartisan.com" className="text-blue-600 underline">support@digitalproductsartisan.com</a>.</li>
        <li>📂 <strong>How do I unzip files?</strong> – Use WinRAR, 7-Zip, or Mac Archive Utility to extract .zip files.</li>
        <li>📦 <strong>Can I redownload later?</strong> – Yes, your email receipt contains permanent links.</li>
      </ul>

      <p className="mt-6 text-gray-600">
        Still need help? Visit our <a href="/contact" className="text-blue-600 underline">Contact Page</a>.
      </p>
    </main>
  )
}
