"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileLinks = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
    { href: "/best-seller", label: "Best Seller" },
    { href: "/new-releases", label: "New Releases" },
    { href: "/bundles", label: "Bundles" },
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Left - Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="Digital Products Artisan"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Nav Links - Mobile (between logo & cart) */}
        <nav className="hidden md:flex space-x-6">
          {/* Keep desktop nav same as before */}
          <Link href="/products" className="hover:text-blue-500">
            Products
          </Link>
          <Link href="/categories" className="hover:text-blue-500">
            Categories
          </Link>
          <Link href="/contact" className="hover:text-blue-500">
            Contact
          </Link>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-blue-500">
            🛒
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
          <ul className="space-y-3">
            {mobileLinks.map((link) => (
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
