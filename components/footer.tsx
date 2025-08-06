'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Digital Products Artisan</h3>
          <p className="text-sm text-gray-400">
            Curated digital resources to boost creativity, productivity, and business impact.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/categories/ebooks" className="hover:underline">
                📚 eBooks
              </Link>
            </li>
            <li>
              <Link href="/categories/digital-art" className="hover:underline">
                🎨 Digital Art
              </Link>
            </li>
            <li>
              <Link href="/categories/templates" className="hover:underline">
                🗂️ Templates
              </Link>
            </li>
            <li>
              <Link href="/categories/marketing-tools" className="hover:underline">
                📢 Marketing Tools
              </Link>
            </li>
            <li>
              <Link href="/categories/printable-planners" className="hover:underline">
                📝 Printable Planners
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/faq" className="hover:underline">
                ❓ FAQ
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:underline">
                🔁 Returns
              </Link>
            </li>
            <li>
              <a href="mailto:support@digitalproductsartisan.com" className="hover:underline">
                📧 Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/about" className="hover:underline">
                🙋 About Us
              </Link>
            </li>
            <li>
              <a
                href="https://digitalproductsartisan.com/sitemap.xml"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Digital Products Artisan. All rights reserved.
      </div>
    </footer>
  )
}
