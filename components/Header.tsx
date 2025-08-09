'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detect iOS for animation tweak
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent
      setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream)
    }
  }, [])

  const fadeInClass = isIOS ? 'animate-fadeIn-ios' : 'animate-fadeIn'

  return (
    <header className="mobile-header-fit">
      {/* Logo */}
      <Link href="/">
        <img src="/logo.svg" alt="Logo" />
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-4">
        <Link href="/products" className="nav-link">Products</Link>
        <Link href="/categories" className="nav-link">Categories</Link>
        <Link href="/about" className="nav-link">About</Link>
        <div className="relative">
          <button onClick={() => setSubmenuOpen(!submenuOpen)} className="nav-link flex items-center">
            Support <ChevronDown size={16} />
          </button>
          {submenuOpen && (
            <div className={`${fadeInClass} absolute top-full mt-2 p-4 bg-white shadow-lg rounded-md`}>
              <Link href="/support/contact" className="block">Contact</Link>
              <Link href="/support/help" className="block">Help Center</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`${fadeInClass} fixed top-0 left-0 w-full h-full bg-white p-6 overflow-auto`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Link href="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/categories" className="mobile-link" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link href="/about" className="mobile-link" onClick={() => setMenuOpen(false)}>About</Link>

          <div className="mt-4">
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className="mobile-link flex items-center"
            >
              Support <ChevronDown size={16} />
            </button>
            {submenuOpen && (
              <div className={`${fadeInClass} ml-4 mt-2`}>
                <Link href="/support/contact" className="block" onClick={() => setMenuOpen(false)}>Contact</Link>
                <Link href="/support/help" className="block" onClick={() => setMenuOpen(false)}>Help Center</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
