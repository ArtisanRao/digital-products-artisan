'use client'

import React, { useState } from 'react'
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
import Logo from '@/components/Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { items } = useCart()
  const { user, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const clearSearch = () => setSearchTerm('')

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 overflow-x-hidden">
      <div className="container mx-auto px-4 !py-0 max-w-full">
        <div className="flex flex-wrap items-center justify-between h-16 gap-2">

          {/* Mobile Header Nav - SHOW only on mobile */}
          <nav className="flex md:hidden items-center space-x-3 flex-shrink-0 overflow-x-auto no-scrollbar">
            <Logo size="md" className="flex-shrink-0" />

            <Link href="/products" className="nav-link whitespace-nowrap">
              Products
            </Link>
            <Link href="/categories" className="nav-link whitespace-nowrap">
              Categories
            </Link>
            <Link href="/about" className="nav-link whitespace-nowrap">
              About
            </Link>

            {/* Support Dropdown (same style as desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  className="nav-link inline-flex items-center space-x-1 whitespace-nowrap"
                >
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
          </nav>

          {/* Desktop Nav (unchanged, still has Bundles) */}
          <nav className="hidden md:flex items-center space-x-8 flex-shrink-0">
            <Link href="/products" className="nav-link">Products</Link>
            <Link href="/bundles" className="nav-link">Bundles</Link>
            <Link href="/categories" className="nav-link">Categories</Link>
            <Link href="/about" className="nav-link">About</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  className="nav-link inline-flex items-center space-x-1"
                >
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
          </nav>

          {/* Search (desktop only) */}
          <div className="hidden md:flex items-center space-x-2 ml-6 relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md"
              aria-label="Search products"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                aria-label="Clear search input"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            )}
          </div>

          {/* Auth + Cart + Mobile toggle */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-700 inline-flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-blue-200">
                  <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/orders">My Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/subscriptions">Subscriptions</Link></DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-700">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Cart - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="relative hover:bg-blue-50 hidden md:inline-flex"
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile toggle button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-blue-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 bg-blue-50/50 animate-fadeIn overflow-x-hidden">
            <nav className="flex flex-col space-y-4 max-w-full">
              <Link href="/products" className="mobile-link">Products</Link>
              <Link href="/bundles" className="mobile-link">Bundles</Link>
              <Link href="/categories" className="mobile-link">Categories</Link>
              <Link href="/about" className="mobile-link">About</Link>

              {/* Support dropdown as collapsible on mobile */}
              <details className="mobile-link group">
                <summary className="cursor-pointer flex justify-between items-center">
                  Support
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <nav className="pl-4 mt-2 flex flex-col space-y-2">
                  <Link href="/help" className="mobile-link">Help Center</Link>
                  <Link href="/faq" className="mobile-link">FAQ</Link>
                  <Link href="/returns" className="mobile-link">Returns & Refund Policy</Link>
                  <Link href="/contact" className="mobile-link">Contact Us</Link>
                </nav>
              </details>

              {/* Cart inside mobile menu */}
              <Link href="/cart" className="mobile-link flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth buttons for mobile */}
              {!user ? (
                <div className="flex space-x-2 pt-4">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
