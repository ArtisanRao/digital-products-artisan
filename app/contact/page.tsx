export const metadata = {
  title: "Contact Us | Digital Products Artisan",
  description: "Reach out to us with questions, support, or partnership inquiries.",
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">📬 Contact Us</h1>
      <p className="text-gray-700 mb-6">
        Need help or have a question? We're here to support you. Reach out anytime using the details below:
      </p>

      <ul className="text-gray-700 space-y-4">
        <li>
          📧 <strong>Email:</strong> <a href="mailto:support@digitalproductsartisan.com" className="text-blue-600 underline">support@digitalproductsartisan.com</a>
        </li>
        <li>
          💬 <strong>Live Chat:</strong> Available 9am – 6pm CET via the bottom-right chat button (coming soon)
        </li>
        <li>
          🤝 <strong>Collaborations:</strong> <a href="mailto:partners@digitalproductsartisan.com" className="text-blue-600 underline">partners@digitalproductsartisan.com</a>
        </li>
      </ul>

      <p className="mt-8 text-sm text-gray-500">
        Response time: Typically within 24 hours on weekdays.
      </p>
    </main>
  )
}
