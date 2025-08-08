'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logo from './Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supportDetailsRef = useRef<HTMLDetailsElement | null>(null)

  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSupportClick = () => {
    if (supportDetailsRef.current) {
      supportDetailsRef.current.scrollIntoView({ behavior: 'smooth' })
      supportDetailsRef.current.setAttribute('open', 'true')
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Logo size="lg" />

          <nav className="flex items-center space-x-8">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors inline-flex items-center">
                  Support
                  <ChevronDown className="ml-1 w-3 h-3" />
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
          </nav>

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
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-16 w-full">
          <Logo size="md" />

          {/* Mobile Nav Links */}
          <div className="flex items-center space-x-3 ml-4 overflow-x-auto text-nowrap">
            <Link
              href="/products"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              About
            </Link>
          </div>

          {/* Mobile Dropdown Menu */}
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

            <DropdownMenuContent className="w-56 mt-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/products"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/categories"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/about"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSupportClick}>
                Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Hidden anchor for Support section scroll */}
      <details ref={supportDetailsRef} className="hidden" />
    </header>
  )
}
