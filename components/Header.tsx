'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
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
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false)

  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Logo size="lg" />

          <nav className="flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>

            {/* Desktop Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors inline-flex items-center">
                  Support
                  <ChevronDown className="ml-1 w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/help">Help Center</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq">FAQ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/returns">Returns & Refund Policy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact Us</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Cart */}
          <Button variant="ghost" size="sm" asChild className="relative hover:bg-blue-50">
            <Link href="/cart">
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

          {/* Mobile Dropdown Menu */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-blue-600" />
                ) : (
                  <Menu className="w-6 h-6 text-blue-600" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 mt-2">
              <DropdownMenuItem asChild>
                <Link href="/products" className="w-full">Products</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/categories" className="w-full">Categories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about" className="w-full">About</Link>
              </DropdownMenuItem>

              {/* Mobile Support Submenu */}
              <div className="w-full">
                <button
                  className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                  onClick={() => setIsMobileSupportOpen(!isMobileSupportOpen)}
                >
                  <span>Support</span>
                  {isMobileSupportOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isMobileSupportOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link href="/help" className="block px-2 py-1 text-sm hover:bg-blue-50 rounded">Help Center</Link>
                    <Link href="/faq" className="block px-2 py-1 text-sm hover:bg-blue-50 rounded">FAQ</Link>
                    <Link href="/returns" className="block px-2 py-1 text-sm hover:bg-blue-50 rounded">Returns & Refund Policy</Link>
                    <Link href="/contact" className="block px-2 py-1 text-sm hover:bg-blue-50 rounded">Contact Us</Link>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
