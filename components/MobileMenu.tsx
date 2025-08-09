'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isIOS } from '@/utils/isIOS'

interface MobileMenuProps {
  itemCount: number
  user: any | null
  setIsMenuOpen: (open: boolean) => void
}

export function MobileMenu({ itemCount, user, setIsMenuOpen }: MobileMenuProps) {
  const [isAboutOpenMobile, setIsAboutOpenMobile] = useState(false)
  const [isSupportOpenMobile, setIsSupportOpenMobile] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    setIos(isIOS())
  }, [])

  const animationClass = ios ? 'animate-fadeIn-ios' : 'animate-fadeIn'

  return (
    <div
      className={`md:hidden fixed inset-x-0 top-[env(safe-area-inset-top)] bg-blue-50/50 border-t border-blue-100
                  overflow-y-auto overflow-x-hidden h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))]
                  pb-[env(safe-area-inset-bottom)] z-50 ${animationClass}`}
    >
      <nav className="flex flex-col space-y-4 p-4">
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
  )
}
