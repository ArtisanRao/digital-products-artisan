"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import Logo from "@/components/Logo"; // ✅ Fixed default import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user?: { name: string };
  itemCount?: number;
}

export function Header({ user, itemCount = 0 }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSupportOpenDesktop, setIsSupportOpenDesktop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpenMobile, setIsAboutOpenMobile] = useState(false);
  const [isSupportOpenMobile, setIsSupportOpenMobile] = useState(false);

  const clearSearch = () => setSearchTerm("");
  const logout = () => {
    // Your logout logic
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-center gap-8 w-full h-16">
        <Logo size="md" />

        <Link href="/products" className="nav-link">Products</Link>
        <Link href="/bundles" className="nav-link">Bundles</Link>
        <Link href="/categories" className="nav-link">Categories</Link>
        <Link href="/about" className="nav-link">About</Link>

        <DropdownMenu open={isSupportOpenDesktop} onOpenChange={setIsSupportOpenDesktop}>
          <DropdownMenuTrigger asChild>
            <button className="nav-link inline-flex items-center space-x-1">
              <span>Support</span>
              <ChevronDown className="w-3 h-3 mt-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-blue-200">
            {[
              { href: "/help", label: "Help Center" },
              { href: "/faq", label: "FAQ" },
              { href: "/returns", label: "Returns & Refund Policy" },
              { href: "/contact", label: "Contact Us" },
            ].map(({ href, label }) => (
              <DropdownMenuItem key={href} asChild>
                <Link href={href} onClick={() => setIsSupportOpenDesktop(false)}>{label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md"
            aria-label="Search products"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>

        {/* Auth Buttons */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 inline-flex items-center">
                <User className="w-4 h-4 mr-2" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-blue-200">
              <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/orders">My Orders</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/subscriptions">Subscriptions</Link></DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-blue-50 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-5 h-5 text-blue-600" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-blue-50/50 border-t border-blue-100 animate-fadeIn 
                     overflow-y-auto overflow-x-hidden h-[calc(100vh-4rem)] pb-[env(safe-area-inset-bottom)]"
          style={{ paddingTop: "env(safe-area-inset-top)" }} // ✅ iPhone safe area
        >
          <nav className="flex flex-col space-y-4 max-w-full p-4">
            <Link href="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link href="/bundles" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Bundles</Link>
            <Link href="/categories" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Categories</Link>

            {/* About dropdown (mobile) */}
            <div className="mobile-link">
              <button onClick={() => setIsAboutOpenMobile(!isAboutOpenMobile)} className="w-full flex justify-between items-center">
                About
                <ChevronDown className={`w-4 h-4 transition-transform ${isAboutOpenMobile ? "rotate-180" : ""}`} />
              </button>
              {isAboutOpenMobile && (
                <nav className="pl-4 mt-2 flex flex-col space-y-2">
                  {[
                    { href: "/about", label: "About Us" },
                    { href: "/team", label: "Our Team" },
                    { href: "/careers", label: "Careers" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                      {label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Support dropdown (mobile) */}
            <div className="mobile-link">
              <button onClick={() => setIsSupportOpenMobile(!isSupportOpenMobile)} className="w-full flex justify-between items-center">
                Support
                <ChevronDown className={`w-4 h-4 transition-transform ${isSupportOpenMobile ? "rotate-180" : ""}`} />
              </button>
              {isSupportOpenMobile && (
                <nav className="pl-4 mt-2 flex flex-col space-y-2">
                  {[
                    { href: "/help", label: "Help Center" },
                    { href: "/faq", label: "FAQ" },
                    { href: "/returns", label: "Returns & Refund Policy" },
                    { href: "/contact", label: "Contact Us" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                      {label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="mobile-link flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth buttons (mobile) */}
            {!user && (
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
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;
