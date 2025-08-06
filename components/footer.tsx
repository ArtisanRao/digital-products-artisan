'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] text-white px-6 py-10 md:px-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + Description */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="/logo.png"
              alt="Digital Products Artisan Logo"
              width={50}
              height={50}
            />
            <div>
              <h2 className="text-xl font-bold">Digital Products</h2>
              <p className="text-blue-400 -mt-1">Artisan</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            Empowering creators with high-quality digital downloads. From templates to ebooks, we provide the tools you need to succeed in the digital world.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xl text-gray-300">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/all-products">All Products</Link></li>
            <li><Link href="/bundles">Bundles</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/bestsellers">Best Sellers</Link></li>
            <li><Link href="/new-releases">New Releases</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/affiliate">Affiliate Program</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-2">
        <p>© 2025 Digital Products Artisan. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
