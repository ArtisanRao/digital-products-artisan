"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    // Auto-collapse menu after clicking a link in mobile view
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-new.png"
            alt="Digital Products Artisan Logo"
            width={160}
            height={40}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-[38px]">
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link href="/bundles" className="hover:text-blue-600">
            Bundles
          </Link>
          <Link href="/categories" className="hover:text-blue-600">
            Categories
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/support" className="hover:text-blue-600">
            Support
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-2 py-1"
          />
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/signup" className="hover:text-blue-600">
            Sign Up
          </Link>
          <Link href="/cart" className="hover:text-blue-600 flex items-center">
            <ShoppingCart size={20} />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={handleMenuClick}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-[38px]">
          <Link href="/products" onClick={handleNavClick}>
            Products
          </Link>
          <Link href="/categories" onClick={handleNavClick}>
            Categories
          </Link>
          <Link href="/about" onClick={handleNavClick}>
            About
          </Link>
          <Link href="/support" onClick={handleNavClick}>
            Support
          </Link>
          <Link href="/bundles" onClick={handleNavClick}>
            Bundles
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md px-2 py-1"
          />
          <Link href="/login" onClick={handleNavClick}>
            Login
          </Link>
          <Link href="/signup" onClick={handleNavClick}>
            Sign Up
          </Link>
          <Link href="/cart" className="flex items-center" onClick={handleNavClick}>
            <ShoppingCart size={20} className="mr-1" /> Cart
          </Link>
        </nav>
      )}
    </header>
  );
}
