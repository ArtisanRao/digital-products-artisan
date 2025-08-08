'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
            <Link
              href="#"
              onClick={handleSupportClick}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Support
            </Link>
          </nav>
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
            <Link
              href="#"
              onClick={handleSupportClick}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Support
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

            <DropdownMenuContent align="end" className="w-56 mt-2">
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
              <DropdownMenuItem
                onClick={handleSupportClick}
                className="cursor-pointer"
              >
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
