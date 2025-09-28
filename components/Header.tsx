'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';
import CartBadge from '@/components/nav/CartBadge';
import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpenDesktop, setIsSupportOpenDesktop] = useState(false);
  const [isAboutOpenMobile, setIsAboutOpenMobile] = useState(false);
  const [isSupportOpenMobile, setIsSupportOpenMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Be tolerant to missing fields on the auth context
  const auth: any = (useAuth as any)?.() ?? {};
  const user = auth?.user ?? null;
  const logout: (() => void) = auth?.logout ?? (() => {});

  const routeMap = useMemo<Record<string, string>>(
    () => ({
      about: '/about',
      bundles: '/bundles',
      products: '/products',
      categories: '/categories',
      support: '/help',
    }),
    []
  );

  const clearSearch = () => setSearchTerm('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    if (term in routeMap) router.push(routeMap[term]);
    else router.push(`/search?q=${encodeURIComponent(term)}`);
    clearSearch();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 overflow-x-hidden">
      <div className="container mx-auto px-4 !py-0 max-w-full">
        <div className="flex flex-wrap items-center justify-center h-16 gap-2">
          {/* Mobile header row */}
          <nav className="flex md:hidden items-center justify-center gap-3 flex-shrink-0 overflow-x-auto no-scrollbar">
            <Logo size="md" className="flex-shrink-0" />
            <Link href="/products" className="nav-link whitespace-nowrap">
              Products
            </Link>
            <Link href="/categories" className="nav-link whitespace-nowrap">
              Categories
            </Link>

            <DropdownMenu open={isSupportOpenMobile} onOpenChange={setIsSupportOpenMobile}>
              <DropdownMenuTrigger asChild>
                <button className="nav-link inline-flex items-center gap-1 whitespace-nowrap" aria-haspopup="menu">
                  <span>Support</span>
                  <ChevronDown className="w-3 h-3 mt-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-blue-200">
                {[
                  { href: '/help', label: 'Help Center' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/returns', label: 'Returns & Refund Policy' },
                  { href: '/contact', label: 'Contact Us' },
                ].map(({ href, label }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} onClick={() => setIsSupportOpenMobile(false)}>
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-blue-50"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5 text-blue-600" />}
            </Button>
          </nav>

          {/* Desktop row */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            <Logo size="md" className="flex-shrink-0" />

            <nav className="flex items-center gap-6">
              <Link href="/products" className="nav-link">
                Products
              </Link>
              <Link href="/bundles" className="nav-link">
                Bundles
              </Link>
              <Link href="/categories" className="nav-link">
                Categories
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>

              <DropdownMenu open={isSupportOpenDesktop} onOpenChange={setIsSupportOpenDesktop}>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link inline-flex items-center space-x-1" aria-haspopup="menu">
                    <span>Support</span>
                    <ChevronDown className="w-3 h-3 mt-0.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-blue-200">
                  {[
                    { href: '/help', label: 'Help Center' },
                    { href: '/faq', label: 'FAQ' },
                    { href: '/returns', label: 'Returns & Refund Policy' },
                    { href: '/contact', label: 'Contact Us' },
                  ].map(({ href, label }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} onClick={() => setIsSupportOpenDesktop(false)}>
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center space-x-2 relative flex-grow min-w-[120px] max-w-[300px] w-full"
              role="search"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md w-full"
                aria-label="Search products"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              )}
            </form>

            {/* Auth (desktop) */}
            {!user ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/account" className="text-sm hover:underline">
                  Hi{user?.name ? `, ${String(user.name).split(' ')[0]}` : ''} 👋
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout?.()}>
                  Log out
                </Button>
              </div>
            )}

            {/* Cart (desktop) */}
            <Link href="/cart" className="relative inline-flex items-center hover-lift">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <CartBadge className="-right-2 -top-2 absolute h-5 min-w-[1.25rem] px-1" />
              <span className="sr-only">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100 bg-blue-50/50 animate-fadeIn overflow-x-hidden">
            <nav className="flex flex-col space-y-4 max-w-full">
              {/* Mobile search */}
              <form onSubmit={handleSearchSubmit} className="relative px-2" role="search">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md w-full"
                />
              </form>

              <Link href="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link href="/bundles" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Bundles
              </Link>
              <Link href="/categories" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>

              {/* About (accordion) */}
              <div className="mobile-link">
                <button
                  onClick={() => setIsAboutOpenMobile((v) => !v)}
                  className="w-full flex justify-between items-center"
                  aria-expanded={isAboutOpenMobile}
                >
                  About
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isAboutOpenMobile ? 'rotate-180' : ''}`}
                  />
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              {/* Cart + Auth (mobile) */}
              <Link
                href="/cart"
                className="mobile-link flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Cart</span>
                <CartBadge className="ml-2 h-5 min-w-[1.25rem]" />
              </Link>

              {!user ? (
                <>
                  <Link href="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/orders" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link href="/subscriptions" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Subscriptions
                  </Link>
                  <button
                    onClick={() => {
                      logout?.();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-link text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
