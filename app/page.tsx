"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topNavMobile = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
  ];

  const mobileMenuLinks = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
    { href: "/best-seller", label: "Best Seller" },
    { href: "/new-releases", label: "New Releases" },
    { href: "/bundles", label: "Bundles" },
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/images/logo.png"
            alt="Digital Products Artisan"
            className="h-10 w-auto"
          />
        </Link>

        {/* Mobile Nav Links (between logo & menu) */}
        <nav className="flex items-center space-x-4 overflow-x-auto md:hidden">
          {topNavMobile.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
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
            href="/support"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Support
          </Link>
        </nav>

        {/* Right Side: Cart + Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Link href="/cart" className="relative hover:text-blue-500">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            {/* Example count badge */}
            {/* <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
              3
            </span> */}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
          <ul className="space-y-3">
            {mobileMenuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
