'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is Digital Products Artisan?',
    answer:
      'Digital Products Artisan is a curated marketplace for premium digital goods — ebooks, AI prompts & packs, templates, graphics, planners, and productivity assets. Whether you\'re a creator, entrepreneur, building a brand, managing a project, boosting creativity or a lifelong learner, we offer the tools you need to bring your vision to life — all delivered instantly and effortlessly, with no fluff.',
  },
  {
    question: 'Are your digital products compatible with my software?',
    answer:
      'Most of our products come in widely supported formats like PDF, PSD, PNG, DOCX, and more. Product pages include compatibility details — always check there first.',
  },
  {
    question: 'Can I customize the templates I purchase?',
    answer:
      'Yes! Many of our templates are fully editable using common software like Microsoft Office, Google Docs, Adobe tools, or Canva (if stated). Customization instructions are usually included.',
  },
  {
    question: 'Is there a limit to how many times I can download my purchase?',
    answer:
      'No, once you\'ve purchased a product, the download link is yours to use at any time. If the link expires or is lost, just contact us.',
  },
  {
    question: 'How long will my download link be active?',
    answer:
      'Download links are typically active for at least 7 days after purchase. However, we\'re happy to reactivate or resend it if needed.',
  },
  {
    question: 'Do I need an account to purchase or download?',
    answer:
      'No account is required to make a purchase, but creating one allows you to track orders and easily access your downloads anytime.',
  },
  {
    question: 'Can I get an invoice or receipt?',
    answer:
      'Yes, a receipt is automatically emailed to you after purchase. If you need a business invoice, contact support with your billing details.',
  },
  {
    question: 'Do you offer bulk or business licensing?',
    answer:
      'We offer commercial licenses for most products and can arrange bulk or extended licensing for teams. Contact us with your request.',
  },
  {
    question: 'I found a bug or issue with a file. What should I do?',
    answer:
      'Please contact us immediately with details and a screenshot if possible. We’ll replace, update, or assist you as quickly as possible.',
  },
  {
    question: 'What forms of payment do you accept?',
    answer:
      'We accept major credit/debit cards and digital wallets via Snipcart’s secure checkout system.',
  },
  {
    question: 'Are your products refundable?',
    answer:
      'Due to the nature of digital goods, all sales are final. Please review the product descriptions and previews carefully before purchase.',
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="text-lg font-medium text-gray-800">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
