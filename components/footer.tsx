'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "What is Digital Products Artisan?",
    answer:
      "Digital Products Artisan is a curated marketplace for premium digital goods — ebooks, AI prompts & packs, templates, graphics, planners, and productivity assets...",
  },
  // ... rest of FAQs
]

export default function FooterFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="bg-gray-50 py-16 px-4">
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
                className="w-full text-left px-6 py-4 font-semibold text-lg hover:bg-gray-100 transition flex justify-between items-center"
                aria-expanded={openIndex === idx}
                aria-controls={`faq-${idx}`}
              >
                <span>{faq.question}</span>
                <span className="text-xl">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div
                  id={`faq-${idx}`}
                  className="px-6 pb-4 text-gray-700 text-sm"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
