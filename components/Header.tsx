'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Logo from './Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/categories" className="hover:text-blue-600">Categories</Link>

            {/* Support dropdown for desktop */}
            <div className="relative group">
              <button className="flex items-center hover:text-blue-600">
                Support <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded mt-2 w-48">
                <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ</Link>
                <Link href="/returns" className="block px-4 py-2 hover:bg-gray-100">Returns</Link>
                <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
              </div>
            </div>

            <Link href="/about" className="hover:text-blue-600">About</Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/categories" className="block py-2" onClick={() => setIsMenuOpen(false)}>Categories</Link>

          {/* Support with dropdown in mobile */}
          <div>
            <button
              className="flex items-center justify-between w-full py-2"
              onClick={() => setIsSupportOpen(!isSupportOpen)}
            >
              Support
              <ChevronDown className={`w-4 h-4 transform ${isSupportOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSupportOpen && (
              <div className="ml-4 space-y-1">
                <Link href="/faq" className="block py-1" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                <Link href="/returns" className="block py-1" onClick={() => setIsMenuOpen(false)}>Returns</Link>
                <Link href="/contact" className="block py-1" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </div>
            )}
          </div>

          <Link href="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
        </div>
      )}
    </header>
  )
}
