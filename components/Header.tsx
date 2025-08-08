'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logo from '@/components/logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { items } = useCart()
  const { user } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const supportDetailsRef = useRef<HTMLDetailsElement | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4 max-w-full">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-center space-x-10 h-16">
          <Logo size="md" />

          <nav className="flex items-center space-x-8">
            <Link
              href="/products"
              className="nav-link px-3 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Products
            </Link>
            <Link
              href="/bundles"
              className="nav-link px-3 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Bundles
            </Link>
            <Link
              href="/categories"
              className="nav-link px-3 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="nav-link px-3 py-2 rounded-md hover:bg-blue-50 transition"
            >
              About
            </Link>

            {/* Support dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link inline-flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-50 transition">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 mt-0.5 transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-blue-200">
                <DropdownMenuItem asChild>
                  <Link href="/help" className="px-3 py-2 rounded-md hover:bg-blue-50">
                    Help Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="px-3 py-2 rounded-md hover:bg-blue-50">
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/returns" className="px-3 py-2 rounded-md hover:bg-blue-50">
                    Returns & Refund Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="px-3 py-2 rounded-md hover:bg-blue-50">
                    Contact Us
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-56 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md"
                aria-label="Search products"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search input"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative hover:bg-blue-50"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
          </nav>
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between h-16 px-4 w-full max-w-full">
          <Logo size="md" />

          {/* Mobile menu toggle */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-blue-600" />
                ) : (
                  <Menu className="w-6 h-6 text-blue-600" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border-blue-200 p-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/categories"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  Categories
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  About
                </Link>
              </DropdownMenuItem>

              {/* Support submenu using details */}
              <details className="group" role="group" ref={supportDetailsRef}>
                <summary className="cursor-pointer flex justify-between items-center px-4 py-2 rounded-md hover:bg-blue-50 transition">
                  Support
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <nav
                  className="pl-6 flex flex-col space-y-2 mt-2"
                  onClick={() => {
                    if (supportDetailsRef.current) supportDetailsRef.current.open = false
                    setIsMenuOpen(false)
                  }}
                >
                  <Link
                    href="/help"
                    className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="/faq"
                    className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/returns"
                    className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                  >
                    Returns & Refund Policy
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                  >
                    Contact Us
                  </Link>
                </nav>
              </details>

              {/* Cart inside menu */}
              <DropdownMenuItem asChild>
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  Cart ({itemCount})
                </Link>
              </DropdownMenuItem>

              {!user && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 rounded-md hover:bg-blue-50 transition"
                    >
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 
