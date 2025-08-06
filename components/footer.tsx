'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "What is Digital Products Artisan?",
    answer:
      "Digital Products Artisan is a curated marketplace for premium digital goods — ebooks, AI prompts & packs, templates, graphics, planners, and productivity assets. Whether you're a creator, entrepreneur, building a brand, managing a project, boosting creativity or a lifelong learner, we offer the tools you need to bring your vision to life — all delivered instantly and effortlessly, with no fluff.",
  },
  {
    question: "Are your digital products compatible with my software?",
    answer:
      "Most of our products come in widely supported formats like PDF, PSD, PNG, DOCX, and more. Product pages include compatibility details — always check there first.",
  },
  {
    question: "Can I customize the templates I purchase?",
    answer:
      "Yes! Many of our templates are fully editable using common software like Microsoft Office, Google Docs, Adobe tools, or Canva (if stated). Customization instructions are usually included.",
  },
  {
    question: "Is there a limit to how many times I can download my purchase?",
    answer:
      "No, once you've purchased a product, the download link is yours to use at any time. If the link expires or is lost, just contact us.",
  },
  {
    question: "How long will my download link be active?",
    answer:
      "Download links are typically active for at least 7 days after purchase. However, we’re happy to reactivate or resend it if needed.",
  },
  {
    question: "Do I need an account to purchase or download?",
    answer:
      "No account is required to make a purchase, but creating one allows you to track orders and easily access your downloads anytime.",
  },
  {
    question: "Can I get an invoice or receipt?",
    answer:
      "Yes, a receipt is automatically emailed to you after purchase. If you need a business invoice, contact support with your billing details.",
  },
  {
    question: "Do you offer bulk or business licensing?",
    answer:
      "We offer commercial licenses for most products and can arrange bulk or extended licensing for teams. Contact us with your request.",
  },
  {
    question: "I found a bug or issue with a file. What should I do?",
    answer:
      "Please contact us immediately with details and a screenshot if possible. We’ll replace, update, or assist you as quickly as possible.",
  },
]

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <footer className="bg-gray-50 text-gray-800">
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-10 text-lg">
            Everything you need to know about our digital products and services
          </p>
          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border rounded-md bg-white shadow-sm hover:shadow-md transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                  className="w-full text-left px-6 py-4 font-semibold text-lg hover:bg-gray-100 transition flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`transform transition-transform duration-300 ${
                      openIndex === idx ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-4 text-gray-700 text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional Footer Section */}
      <div className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-2">Digital Products Artisan</h4>
            <p>Your source for premium ebooks, templates, planners, and more.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="/categories/ebooks" className="hover:underline">eBooks</a></li>
              <li><a href="/categories/templates" className="hover:underline">Templates</a></li>
              <li><a href="/categories/printable-planners" className="hover:underline">Planners</a></li>
              <li><a href="/categories/digital-art" className="hover:underline">Digital Art</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Support</h4>
            <ul className="space-y-1">
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Digital Products Artisan. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
