'use client'

import * as React from 'react'
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
  const { user, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const supportDetailsRef = useRef<HTMLDetailsElement | null>(null)
  function handleSupportSubmenuClick() {
    if (supportDetailsRef.current) supportDetailsRef.current.open = false
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-center space-x-8 h-16">
          <Logo size="md" />
          <nav className="flex items-center space-x-6">
            <Link href="/products" className="nav-link">Products</Link>
            <Link href="/bundles" className="nav-link">Bundles</Link>
            <Link href="/categories" className="nav-link">Categories</Link>
            <Link href="/about" className="nav-link">About</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link inline-flex items-center space-x-1">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 mt-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-blue-200">
                <DropdownMenuItem asChild><Link href="/help">Help Center</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/faq">FAQ</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/returns">Returns & Refund Policy</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/contact">Contact Us</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          </nav>
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between h-16 px-4">
          <Logo size="md" />
          <Button
            variant="ghost"
            size="sm"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-blue-600" />}
          </Button>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t border-blue-100 shadow-sm">
            <div className="flex flex-col space-y-1 p-4">
              <Link href="/products" className="mobile-nav-link">Products</Link>
              <Link href="/bundles" className="mobile-nav-link">Bundles</Link>
              <Link href="/categories" className="mobile-nav-link">Categories</Link>
              <Link href="/about" className="mobile-nav-link">About</Link>

              <details ref={supportDetailsRef} className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2 font-medium text-blue-700">
                  Support
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="flex flex-col pl-4 space-y-1">
                  <Link href="/help" className="mobile-nav-link" onClick={handleSupportSubmenuClick}>Help Center</Link>
                  <Link href="/faq" className="mobile-nav-link" onClick={handleSupportSubmenuClick}>FAQ</Link>
                  <Link href="/returns" className="mobile-nav-link" onClick={handleSupportSubmenuClick}>Returns & Refund Policy</Link>
                  <Link href="/contact" className="mobile-nav-link" onClick={handleSupportSubmenuClick}>Contact Us</Link>
                </div>
              </details>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
