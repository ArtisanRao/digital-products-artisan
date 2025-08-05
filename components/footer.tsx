import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo size="md" showText={false} />
              <div className="flex flex-col mt-2">
                <span className="font-bold text-xl text-white leading-tight">Digital Products</span>
                <span className="font-semibold text-base bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight -mt-1">
                  Artisan
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering creators with high-quality digital downloads. From templates to ebooks, we provide the tools
              you need to succeed in the digital world.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-900/30"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-900/30"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-900/30"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-900/30"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/bundles"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Bundles
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/bestsellers"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/new-releases"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blue-300">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-gray-300 hover:text-blue-300 transition-colors hover:translate-x-1 inline-block"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Digital Products Artisan. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-300 transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
