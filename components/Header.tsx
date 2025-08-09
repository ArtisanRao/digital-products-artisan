'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { items } = useCart();
  const itemCount = items.length;
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpenMobile, setIsAboutOpenMobile] = useState(false);
  const [isSupportOpenMobile, setIsSupportOpenMobile] = useState(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Digital Products Artisan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/categories" className="hover:text-blue-500">Categories</Link>
          <div className="group relative">
            <button className="hover:text-blue-500">About</button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 w-48">
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">Our Story</Link>
              <Link href="/mission" className="block px-4 py-2 hover:bg-gray-100">Mission</Link>
            </div>
          </div>
          <div className="group relative">
            <button className="hover:text-blue-500">Support</button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 w-48">
              <Link href="/faq" className="block px-4 py-2 hover:bg-gray-100">FAQ</Link>
              <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
            </div>
          </div>
        </nav>

        {/* User & Cart */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link href="/account" className="hover:text-blue-500">Account</Link>
          ) : (
            <Link href="/login" className="hover:text-blue-500">Login</Link>
          )}
          <Link href="/cart" className="relative hover:text-blue-500">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {itemCount}
              </span>
            )}
          </Link>
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 pt-4 pb-6 space-y-2 h-[100dvh] overflow-y-auto pb-safe">
          <Link href="/" className="block hover:text-blue-500">Home</Link>
          <Link href="/categories" className="block hover:text-blue-500">Categories</Link>

          {/* About Section */}
          <div>
            <button
              className="w-full text-left hover:text-blue-500"
              onClick={() => setIsAboutOpenMobile(!isAboutOpenMobile)}
            >
              About {isAboutOpenMobile ? '▲' : '▼'}
            </button>
            {isAboutOpenMobile && (
              <div className="pl-4 space-y-1">
                <Link href="/about" className="block hover:text-blue-500">Our Story</Link>
                <Link href="/mission" className="block hover:text-blue-500">Mission</Link>
              </div>
            )}
          </div>

          {/* Support Section */}
          <div>
            <button
              className="w-full text-left hover:text-blue-500"
              onClick={() => setIsSupportOpenMobile(!isSupportOpenMobile)}
            >
              Support {isSupportOpenMobile ? '▲' : '▼'}
            </button>
            {isSupportOpenMobile && (
              <div className="pl-4 space-y-1">
                <Link href="/faq" className="block hover:text-blue-500">FAQ</Link>
                <Link href="/contact" className="block hover:text-blue-500">Contact</Link>
              </div>
            )}
          </div>

          {/* Login/Account Link */}
          {user ? (
            <Link href="/account" className="block hover:text-blue-500">Account</Link>
          ) : (
            <Link href="/login" className="block hover:text-blue-500">Login</Link>
          )}

          {/* Cart Link */}
          <Link href="/cart" className="relative hover:text-blue-500">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
