'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'

const navItems = [
  { name: 'Products', href: '/products' },
  { name: 'Bundles', href: '/bundles' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' }, // ✅ Replaced Affiliate with About
  { name: 'Support', href: '/support' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
            Digital Products Artisan
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium ${
                  pathname === item.href ? 'text-blue-600' : 'text-gray-600'
                } hover:text-blue-600`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Search, Login, Signup, Cart */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden md:block px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-blue-600">
              <ShoppingCart size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
