'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0D2F6E] to-[#1B3A8C] text-white py-12 px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="/images/logo.png"
              alt="Digital Products Artisan Logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <div>
              <h2 className="text-2xl font-bold leading-tight">
                Digital Products <br />
                <span className="text-[#699CF7]">Artisan</span>
              </h2>
            </div>
          </div>
          <p className="text-gray-300 max-w-xs leading-relaxed">
            Empowering creators with high-quality digital downloads. From templates to ebooks, we provide the tools you need to succeed in the digital world.
          </p>
          <div className="flex space-x-6 mt-6 text-gray-400">
            <a href="#" aria-label="Facebook" className="hover:text-white transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.3V12h2.3l-.4 3H13v7A10 10 0 0022 12z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.65 8.65 0 01-2.73 1.04 4.29 4.29 0 00-7.31 3.91A12.18 12.18 0 013 4.74a4.29 4.29 0 001.33 5.72 4.27 4.27 0 01-1.94-.54v.05a4.3 4.3 0 003.44 4.21 4.28 4.28 0 01-1.93.07 4.3 4.3 0 004 3 8.6 8.6 0 01-5.32 1.83A8.62 8.62 0 012 19.54a12.15 12.15 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.7 8.7 0 0022.46 6z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-white transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21.8 7.1a2.8 2.8 0 00-1.96-1.96C18.4 4.8 12 4.8 12 4.8s-6.4 0-7.84.33a2.8 2.8 0 00-1.96 1.96A29.7 29.7 0 002 12a29.7 29.7 0 00.2 4.9 2.8 2.8 0 001.96 1.96C5.6 19.2 12 19.2 12 19.2s6.4 0 7.84-.33a2.8 2.8 0 001.96-1.96 29.7 29.7 0 00.2-4.9 29.7 29.7 0 00-.2-4.9zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-[#699CF7]">Quick Links</h3>
          <ul className="space-y-4 text-gray-300">
            <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
            <li><Link href="/bundles" className="hover:text-white transition">Bundles</Link></li>
            <li><Link href="/categories" className="hover:text-white transition">Categories</Link></li>
            <li><Link href="/bestsellers" className="hover:text-white transition">Best Sellers</Link></li>
            <li><Link href="/new-releases" className="hover:text-white transition">New Releases</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-[#699CF7]">Support</h3>
          <ul className="space-y-4 text-gray-300">
            <li><Link href="/help-center" className="hover:text-white transition">Help Center</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="/returns" className="hover:text-white transition">Returns</Link></li>
            <li><Link href="/affiliate" className="hover:text-white transition">Affiliate Program</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-blue-700 pt-6 flex flex-col md:flex-row justify-between text-gray-400 text-sm">
        <div>© 2024 Digital Products Artisan. All rights reserved.</div>
        <div className="space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <button
        aria-label="Help Chat"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-[#3CA0F0] to-[#1968D3] shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </footer>
  )
}
