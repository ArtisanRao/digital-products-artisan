'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const policies = [
  {
    title: 'Privacy Policy',
    content:
      'We respect your privacy and are committed to protecting your personal data. Any information collected during your use of our site is used solely for order processing, support, and improving your experience. We do not sell or share your data.',
  },
  {
    title: 'Terms of Service',
    content:
      "By purchasing and downloading from Digital Products Artisan, you agree not to redistribute, resell, or reproduce our products without permission. All items are licensed to the buyer only, and usage is subject to each product's license.",
  },
  {
    title: 'Cookies',
    content:
      'We use cookies to personalize content, analyze traffic, and offer a better user experience. By continuing to browse, you consent to the use of cookies in accordance with our policy.',
  },
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const year = new Date().getFullYear();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Left Section */}
        <div className="md:w-1/2 pl-0 md:pl-10">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo-new.png"
              alt="Digital Products Artisan logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
            <div>
              <h2 className="text-white text-xl font-bold leading-tight">
                Digital Products
              </h2>
              <span className="text-blue-400 font-medium">Artisan</span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed">
            Empowering creators with high-quality digital downloads. From
            templates to ebooks, we provide the tools you need to succeed in the
            digital world.
          </p>

          <div className="flex mt-4 space-x-4 text-lg">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:text-white transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-white transition-colors"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 pr-0 md:pr-10 flex flex-col sm:flex-row justify-end gap-16 sm:gap-24">
          <nav aria-label="Quick links">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="hover:text-white transition-colors">
                  Bundles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products/best-sellers"
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/new-releases"
                  className="hover:text-white transition-colors"
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service#returns"
                  className="hover:text-white transition-colors"
                >
                  Returns &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Footer Bottom with Collapsibles */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-sm w-full max-w-5xl mx-auto space-y-2">
        <p className="text-center text-gray-400 mb-4">
          © {year} Digital Products Artisan. All rights reserved.
        </p>

        {policies.map((policy, i) => {
          const id = `policy-panel-${i}`;
          const isOpen = openIndex === i;
          return (
            <div key={policy.title} className="border border-gray-600 rounded-md overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-300 hover:text-white"
                aria-expanded={isOpen}
                aria-controls={id}
              >
                <span>{policy.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div id={id} className="px-4 pb-4 text-xs text-gray-400 animate-fadeIn">
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
