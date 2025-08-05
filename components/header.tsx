'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Digital Products Artisan
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/products"
            className="text-gray-700 hover:text-blue-700 font-medium transition-colors relative group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/bundles"
            className="text-gray-700 hover:text-blue-700 font-medium transition-colors relative group"
          >
            Bundles
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/about"
            className="text-gray-700 hover:text-blue-700 font-medium transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/support"
            className="text-gray-700 hover:text-blue-700 font-medium transition-colors relative group"
          >
            Support
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-blue-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2">
          <Link
            href="/products"
            className="block text-gray-700 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            Products
          </Link>

          <Link
            href="/bundles"
            className="block text-gray-700 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            Bundles
          </Link>

          <Link
            href="/about"
            className="block text-gray-700 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            About
          </Link>

          <Link
            href="/support"
            className="block text-gray-700 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            Support
          </Link>
        </div>
      )}
    </header>
  )
}
