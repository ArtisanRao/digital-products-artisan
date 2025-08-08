"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Digital Products Artisan"
              className="h-10 w-auto"
            />
            <span className="text-lg font-bold tracking-wide hidden sm:inline-block">
              Digital Products Artisan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <Link href="/bundles" className="hover:text-gray-900">
              Bundles
            </Link>
            <Link href="/categories" className="hover:text-gray-900">
              Categories
            </Link>
            <Link href="/support" className="hover:text-gray-900">
              Support
            </Link>
          </nav>

          {/* Search + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4 border-t mt-2 pt-2">
            <Link href="/products" className="hover:text-gray-900">
              Products
            </Link>
            <Link href="/bundles" className="hover:text-gray-900">
              Bundles
            </Link>
            <Link href="/categories" className="hover:text-gray-900">
              Categories
            </Link>
            <Link href="/support" className="hover:text-gray-900">
              Support
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
