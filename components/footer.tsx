'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useState } from 'react';

const faqs = [
  {
    question: 'What is Digital Products Artisan?',
    answer: 'Digital Products Artisan is a curated marketplace for premium digital goods — ebooks, AI prompts & packs, templates, graphics and more.',
  },
  {
    question: 'How do I access my downloads?',
    answer: 'Once purchased, you’ll receive an email with a secure download link. You can also access your files from your Snipcart invoice.',
  },
  {
    question: 'Can I use the digital products commercially?',
    answer: 'Each product comes with its own license. Most are for personal and commercial use, but check the product page for specific licensing details.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Due to the nature of digital products, we do not offer refunds. Please read product descriptions carefully before purchase.',
  },
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="md:col-span-1">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <div>
              <h2 className="text-white text-xl font-bold">Digital Products</h2>
              <span className="text-blue-400 font-medium">Artisan</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Empowering creators with high-quality digital downloads. From templates to ebooks, we provide the tools you need to succeed in the digital world.
          </p>
          <div className="flex mt-4 space-x-4 text-lg">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/all-products">All Products</Link></li>
              <li><Link href="/bundles">Bundles</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/best-sellers">Best Sellers</Link></li>
              <li><Link href="/new-releases">New Releases</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/affiliate">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-10 border-t border-gray-600 pt-8">
        <h4 className="text-xl font-semibold text-white mb-4">FAQs</h4>
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-700 py-4">
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-sm font-medium text-white">{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
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
              <div className="mt-2 text-sm text-gray-300">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-sm flex flex-col md:flex-row justify-between items-center">
        <p className="mb-2 md:mb-0">© 2025 Digital Products Artisan. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
