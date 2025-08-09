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
  const [isSupportOpenDesktop, setIsSupportOpenDesktop] = useState(false)
  const [isAboutOpenMobile, setIsAboutOpenMobile] = useState(false)
  const [isSupportOpenMobile, setIsSupportOpenMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { items } = useCart()
  const { user, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const clearSearch = () => setSearchTerm('')

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 overflow-x-hidden">
      <div className="container mx-auto px-4 !py-0 max-w-full">
        <div className="flex flex-wrap items-center justify-between h-16 gap-2">

          {/* Mobile Header Nav with Menu Toggle */}
          <nav className="flex md:hidden items-center space-x-3 flex-shrink-0 overflow-x-auto no-scrollbar">
            <Logo size="md" className="flex-shrink-0" />
            <Link href="/products" className="nav-link whitespace-nowrap">Products</Link>
            <Link href="/categories" className="nav-link whitespace-nowrap">Categories</Link>
            {/* Support dropdown in mobile header */}
            <DropdownMenu open={isSupportOpenMobile} onOpenChange={setIsSupportOpenMobile}>
              <DropdownMenuTrigger asChild>
                <button className="nav-link inline-flex items-center space-x-1 whitespace-nowrap">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 mt-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-blue-200">
                {[
                  { href: '/help', label: 'Help Center' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/returns', label: 'Returns & Refund Policy' },
                  { href: '/contact', label: 'Contact Us' },
                ].map(({ href, label }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} onClick={() => setIsSupportOpenMobile(false)}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle button moved here for proximity to Support */}
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-blue-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-blue-600" />}
            </Button>
          </nav>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 flex-shrink-0">
            <Link href="/products" className="nav-link">Products</Link>
            <Link href="/bundles" className="nav-link">Bundles</Link>
            <Link href="/categories" className="nav-link">Categories</Link>
            <Link href="/about" className="nav-link">About</Link>
            <DropdownMenu open={isSupportOpenDesktop} onOpenChange={setIsSupportOpenDesktop}>
              <DropdownMenuTrigger asChild>
                <button className="nav-link inline-flex items-center space-x-1">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 mt-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-blue-200">
                {[
                  { href: '/help', label: 'Help Center' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/returns', label: 'Returns & Refund Policy' },
                  { href: '/contact', label: 'Contact Us' },
                ].map(({ href, label }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} onClick={() => setIsSupportOpenDesktop(false)}>{label}</Link>
                  </DropdownMenuItem>
                ))}
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

          {/* Auth + Cart (desktop only) */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 inline-flex items-center">
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
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Cart (desktop) */}
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 bg-blue-50/50 animate-fadeIn overflow-x-hidden">
            <nav className="flex flex-col space-y-4 max-w-full">
              <Link href="/products" className="mobile-link" onClick={() => { setIsMenuOpen(false); setIsAboutOpenMobile(false); setIsSupportOpenMobile(false); }}>
                Products
              </Link>
              <Link href="/bundles" className="mobile-link" onClick={() => { setIsMenuOpen(false); setIsAboutOpenMobile(false); setIsSupportOpenMobile(false); }}>
                Bundles
              </Link>
              <Link href="/categories" className="mobile-link" onClick={() => { setIsMenuOpen(false); setIsAboutOpenMobile(false); setIsSupportOpenMobile(false); }}>
                Categories
              </Link>

              {/* About dropdown (mobile) */}
              <div className="mobile-link">
                <button onClick={() => setIsAboutOpenMobile(!isAboutOpenMobile)} className="w-full flex justify-between items-center">
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${isAboutOpenMobile ? 'rotate-180' : ''}`} />
                </button>
                {isAboutOpenMobile && (
                  <nav className="pl-4 mt-2 flex flex-col space-y-2">
                    {[
                      { href: '/about', label: 'About Us' },
                      { href: '/team', label: 'Our Team' },
                      { href: '/careers', label: 'Careers' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="mobile-link"
                        onClick={() => { setIsMenuOpen(false); setIsAboutOpenMobile(false); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              {/* Support dropdown (mobile) */}
              <div className="mobile-link">
                <button onClick={() => setIsSupportOpenMobile(!isSupportOpenMobile)} className="w-full flex justify-between items-center">
                  Support
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSupportOpenMobile ? 'rotate-180' : ''}`} />
                </button>
                {isSupportOpenMobile && (
                  <nav className="pl-4 mt-2 flex flex-col space-y-2">
                    {[
                      { href: '/help', label: 'Help Center' },
                      { href: '/faq', label: 'FAQ' },
                      { href: '/returns', label: 'Returns & Refund Policy' },
                      { href: '/contact', label: 'Contact Us' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="mobile-link"
                        onClick={() => { setIsMenuOpen(false); setIsSupportOpenMobile(false); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              {/* Cart */}
              <Link href="/cart" className="mobile-link flex items-center space-x-2" onClick={() => { setIsMenuOpen(false); setIsAboutOpenMobile(false); setIsSupportOpenMobile(false); }}>
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth buttons (mobile) */}
              {!user ? (
                <div className="flex space-x-2 pt-4">
                  <Button variant="ghost" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
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
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
