'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react'
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left side - Logo + some space + Desktop nav (except Support) */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            <Logo size="md" />
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/products" className="nav-link">Products</Link>
              <Link href="/bundles" className="nav-link">Bundles</Link>
              <Link href="/categories" className="nav-link">Categories</Link>
              <Link href="/about" className="nav-link">About</Link>
            </nav>
          </div>

          {/* Center - Mobile nav links (Products, Categories, About) */}
          <nav className="flex md:hidden items-center space-x-4 text-sm">
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <Link href="/categories" className="hover:text-blue-600">Categories</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3 md:space-x-5 flex-shrink-0">

            {/* Desktop Support dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link inline-flex items-center space-x-1">
                    <span>Support</span>
                    <ChevronDown className="w-3 h-3 mt-0.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-blue-200">
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
            </div>

            {/* Desktop search bar */}
            <div className="hidden md:flex items-center space-x-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-56 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md"
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

            {/* Desktop Cart */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative hover:bg-blue-50"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Desktop Menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-blue-600" />
              ) : (
                <Menu className="w-5 h-5 text-blue-600" />
              )}
            </Button>

            {/* Mobile Menu toggle replaces Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-blue-600" />
              ) : (
                <Menu className="w-5 h-5 text-blue-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 bg-blue-50/50 animate-fadeIn">
            <nav className="flex flex-col space-y-4 px-2">
              <Link href="/login" className="mobile-link">Login</Link>
              <Link href="/signup" className="mobile-link">Sign Up</Link>
              <Link href="/best-seller" className="mobile-link">Best Seller</Link>
              <Link href="/new-releases" className="mobile-link">New Releases</Link>
              <Link href="/bundles" className="mobile-link">Bundles</Link>
              {/* Cart inside mobile menu dropdown */}
              <Link href="/cart" className="mobile-link font-semibold flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Cart {itemCount > 0 ? `(${itemCount})` : ''}</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
