'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const returnsPolicyItems = [
  {
    question: "Do you offer refunds for digital products?",
    answer:
      "Since all our products are digital and delivered instantly after purchase, we generally do not offer refunds once a file has been downloaded.",
  },
  {
    question: "What if I have an issue with a downloaded file?",
    answer:
      "If you encounter an issue — such as file corruption, download problems, or incorrect content — please contact us within 7 days of purchase. We will investigate and may offer a replacement or refund at our discretion.",
  },
  {
    question: "How can I request support or a refund?",
    answer:
      "To request assistance, email our support team at support@digitalproductsartisan.com with your order number, a description of the issue, and any relevant screenshots or details.",
  },
  {
    question: "What if the product doesn’t meet my expectations?",
    answer:
      "We stand by the quality of our digital goods and want you to be satisfied. In rare cases where a product does not meet expectations, we’ll work with you to find a fair solution.",
  },
  {
    question: "Are there any refund exceptions?",
    answer:
      "Refunds will not be granted for change-of-mind, accidental purchases, or failure to check product compatibility before buying.",
  },
];

export default function ReturnsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8">Returns & Refund Policy</h1>
      <div className="space-y-4">
        {returnsPolicyItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-300 rounded-xl transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium hover:bg-gray-100 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-4 text-gray-600 animate-fadeIn">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-sm text-center text-gray-500">
        Still have questions? Contact us at{' '}
        <a
          href="mailto:support@digitalproductsartisan.com"
          className="text-blue-600 hover:underline"
        >
          support@digitalproductsartisan.com
        </a>
        .
        <p className="mt-2">Last updated: August 6, 2025</p>
      </div>
    </main>
  );
}
