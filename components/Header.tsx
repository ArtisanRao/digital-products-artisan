'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { items } = useCart()
  const { user, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const clearSearch = () => setSearchTerm('')

  // Auto-collapse support submenu in mobile
  const handleMobileSupportClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 desktop-gap-1cm">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png" // Replace this with your logo path
              alt="Site Logo"
              width={140}
              height={40}
              priority
            />
          </Link>

          {/* Mobile quick nav between logo & menu */}
          <div className="flex md:hidden items-center gap-[1cm]">
            <Link href="/products" className="mobile-link">Products</Link>
            <Link href="/categories" className="mobile-link">Categories</Link>
            <Link href="/about" className="mobile-link">About</Link>
            <Link href="/support" className="mobile-link">Support</Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center desktop-gap-1cm">
            <Link href="/products" className="nav-link">Products</Link>
            <Link href="/bundles" className="nav-link">Bundles</Link>
            <Link href="/categories" className="nav-link">Categories</Link>
            <Link href="/about" className="nav-link">About</Link>

            {/* Support Dropdown */}
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

          {/* Search */}
          <div className="hidden md:flex items-center relative desktop-gap-1cm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            )}
          </div>

          {/* Auth + Cart */}
          <div className="flex items-center desktop-gap-1cm">
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
              <div className="hidden md:flex desktop-gap-1cm">
                <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-700">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Button variant="ghost" size="sm" asChild className="relative hover:bg-blue-50">
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-blue-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 bg-blue-50/50 animate-fadeIn mt-[1cm]">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link href="/bundles" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Bundles</Link>
              <Link href="/categories" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</Link>

              {/* Support with auto-collapse */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleMobileSupportClick}
                  className="mobile-link text-left"
                >
                  Support
                </button>
                <div className="pl-4 flex flex-col space-y-2">
                  <Link href="/help" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Help Center</Link>
                  <Link href="/faq" className="mobile-link" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                  <Link href="/returns" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Returns & Refund Policy</Link>
                  <Link href="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                </div>
              </div>

              {!user && (
                <div className="flex space-x-2 pt-4">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-blue-100" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
