'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
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

const policies = [
  {
    title: 'Privacy Policy',
    content: `We respect your privacy and are committed to protecting your personal data. Any information collected during your use of our site is used solely for order processing, support, and improving your experience. We do not sell or share your data.`,
  },
  {
    title: 'Terms of Service',
    content: `By purchasing and downloading from Digital Products Artisan, you agree not to redistribute, resell, or reproduce our products without permission. All items are licensed to the buyer only, and usage is subject to each product's license.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies to personalize content, analyze traffic, and offer a better user experience. By continuing to browse, you consent to the use of cookies in accordance with our policy.`,
  },
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left Section */}
        <div className="md:w-1/2 pl-10">
          <div className="flex items-center space-x-3">
            <img src="/images/logo-new.png" alt="Logo" className="w-10 h-10 object-contain" />
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
        <div className="md:w-1/2 pr-10 flex flex-col sm:flex-row justify-end gap-24">
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
              <li><Link href="/returns">Returns & Refund Policy</Link></li>
              <li><Link href="/affiliate">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom with Collapsibles */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-sm w-full max-w-5xl mx-auto space-y-2">
        <p className="text-center text-gray-400 mb-4">© 2025 Digital Products Artisan. All rights reserved.</p>

        {policies.map((policy, index) => {
          const isOpen = openIndex === index + 100; // Offset to avoid conflict with FAQ toggle
          return (
            <div key={index} className="border border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => toggle(index + 100)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-300 hover:text-white"
                aria-expanded={isOpen}
              >
                <span>{policy.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-gray-400 animate-fadeIn">
                  {policy.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </footer>
  );
}
